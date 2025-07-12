import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../../Services/Auth/auth.service';
import { RecuperaContraService } from '../../../Services/RecuperarContra/recupera-contra.service';
import { VerificaCorreoService } from '../../../Services/VerificaCorreo/verifica-correo.service';
import { jwtDecode } from 'jwt-decode';

interface JwtPayload {
  id_usuario: number;
  nombre: string;
  correo: string;
  rol: string;
  id_club: number | null;
  exp: number;
  iat: number;
}

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  standalone: false,
})
export class LoginComponent {
  usuarioTemporal: JwtPayload | null = null;

  modoVerificacion: 'login' | 'recuperar' = 'login';

  correo: string = '';
  contrasena: string = '';
  mensaje: string = '';

  captcha: string = '';

  estado: 'login' | 'recuperar' | 'codigo' | 'nueva' = 'login';

  codigo: string = '';
  codigoGenerado: string = '';
  contrasenaNueva: string = '';
  confirmarContrasena: string = '';

  correoValido: boolean | null = null;

  constructor(
    private authService: AuthService,
    private router: Router,
    private recuperaContraService: RecuperaContraService,
    private verificaCorreoService: VerificaCorreoService
  ) {}




ngOnInit(): void {
  const usuario = this.authService.obtenerUsuario();
  console.log('Usuario decodificado:', usuario);
}



login(): void {
  if (!this.captcha) {
    this.mensaje = 'Por favor, completa el CAPTCHA.';
    return;
  }

  if (this.estaBloqueadoFrontend(this.correo)) {
    return; // mensaje ya seteado adentro
  }

  this.authService.login(this.correo, this.contrasena).subscribe(
    (res) => {
      if (res?.success && res.token) {
        try {
          const decoded = jwtDecode<JwtPayload>(res.token);
          this.usuarioTemporal = decoded;
          this.modoVerificacion = 'login';
          this.estado = 'codigo';

          // ✅ Limpiar intentos del frontend
          const bloqueos = JSON.parse(localStorage.getItem('correos_bloqueados') || '{}');
          delete bloqueos[this.correo];
          localStorage.setItem('correos_bloqueados', JSON.stringify(bloqueos));

          this.recuperaContraService.enviarCodigo(this.correo).subscribe(
            (res) => {
              this.codigoGenerado = res.codigo;
              this.mensaje = 'Se envió un código de verificación al correo.';
            },
            () => {
              this.mensaje = 'No se pudo enviar el código de verificación.';
            }
          );
        } catch (err) {
          this.mensaje = 'Error al procesar el token.';
          console.error('Error al decodificar token:', err);
        }
      } else {
        const fueBloqueado = this.registrarIntentoFallidoFrontend(this.correo);
        this.mensaje = fueBloqueado
          ? 'Demasiados intentos con este correo. Intenta nuevamente más tarde.'
          : 'Correo o contraseña incorrectos.';
      }
    },
    (error) => {
      const fueBloqueado = this.registrarIntentoFallidoFrontend(this.correo);
      this.mensaje = fueBloqueado
        ? 'Demasiados intentos con este correo. Intenta nuevamente más tarde.'
        : 'Correo o contraseña incorrectos.';
    }
  );
}


estaBloqueadoFrontend(correo: string): boolean {
  const bloqueos = localStorage.getItem('correos_bloqueados');
  if (!bloqueos) return false;

  const datos = JSON.parse(bloqueos);
  const info = datos[correo];

  if (!info || !info.bloqueado_hasta) return false;

  const ahora = new Date();
  const hasta = new Date(info.bloqueado_hasta);

  if (hasta > ahora) {
    this.mensaje = `Demasiados intentos con este correo. Intenta nuevamente después de ${hasta.toLocaleString()}`;
    return true;
  }

  // Bloqueo expirado
  delete datos[correo];
  localStorage.setItem('correos_bloqueados', JSON.stringify(datos));
  return false;
}


registrarIntentoFallidoFrontend(correo: string): boolean {
  const bloqueos = JSON.parse(localStorage.getItem('correos_bloqueados') || '{}');

  if (!bloqueos[correo]) {
    bloqueos[correo] = { intentos: 1 };
  } else {
    bloqueos[correo].intentos += 1;
  }

  let fueBloqueado = false;

  if (bloqueos[correo].intentos >= 5) {
    const hasta = new Date();
    hasta.setMinutes(hasta.getMinutes() + 2); // ⏱ solo 2 minutos
    bloqueos[correo].bloqueado_hasta = hasta.toISOString();
    bloqueos[correo].intentos = 0;
    fueBloqueado = true;
  }

  localStorage.setItem('correos_bloqueados', JSON.stringify(bloqueos));
  return fueBloqueado;
}





  resolvedCaptcha(token: string) {
    this.captcha = token;
    console.log('Captcha resuelto:', token);
  }

  enviarRecuperacion() {
    this.recuperaContraService.enviarCodigo(this.correo).subscribe({
      next: (res) => {
        if (res.success) {
          this.codigoGenerado = res.codigo;
          this.mensaje = 'Código enviado a tu correo';
          this.estado = 'codigo';
        } else {
          this.mensaje = res.message;
        }
      },
      error: () => (this.mensaje = 'Error al enviar el correo'),
    });
  }

  verificarCodigo() {
    if (this.codigo === this.codigoGenerado) {
      this.mensaje = 'Código verificado';

      if (this.modoVerificacion === 'recuperar') {
        this.estado = 'nueva';
      } else if (this.modoVerificacion === 'login') {
        // Redirigir según el rol del token decodificado
        const rol = this.usuarioTemporal?.rol;

        if (rol === 'dt') {
          this.router.navigate(['/equipo']);
        } else if (rol === 'administrador_equipo') {
          this.router.navigate(['/administrar']);
        } else if (rol === 'administrador_sistema') {
          this.router.navigate(['/Dashboard']);
        }
      }
    } else {
      this.mensaje = 'Código incorrecto';
    }
  }

  cambiarContrasena() {
    if (this.contrasenaNueva !== this.confirmarContrasena) {
      this.mensaje = 'Las contraseñas no coinciden';
      return;
    }

    this.recuperaContraService
      .restablecerContrasena(this.correo, this.contrasenaNueva)
      .subscribe({
        next: (res) => {
          this.mensaje = res.message;
          if (res.success) this.estado = 'login';
        },
        error: () => (this.mensaje = 'Error al cambiar la contraseña'),
      });
  }
}
