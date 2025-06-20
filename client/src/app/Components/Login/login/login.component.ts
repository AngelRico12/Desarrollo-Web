import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../../Services/Auth/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  standalone: false
})
export class LoginComponent {
  correo: string = '';
  contrasena: string = '';
  mensaje: string = '';

  captcha: string = ''; // nuevo: guarda el token del captcha


  constructor(private authService: AuthService, private router: Router) {}

login(): void {
  if (!this.captcha) {
    this.mensaje = 'Por favor, completa el CAPTCHA.';
    return;
  }

  this.authService.login(this.correo, this.contrasena).subscribe(
    (res) => {
      if (res?.success && res.usuario) {
        const rol = res.usuario.rol;
        if (rol === 'dt') {
          this.router.navigate(['/equipo']);
        } else if (rol === 'administrador_equipo') {
          this.router.navigate(['/administrar']);
        } else if (rol === 'administrador_sistema') {
          this.router.navigate(['/dueno']);
        }
        this.mensaje = '';
      } else {
        this.mensaje = 'Correo o contraseña incorrectos';
      }
    },
    (error) => {
      console.error('Error en el servidor:', error);
      this.mensaje = 'Correo o contraseña incorrectos';
    }
  );
}


resolvedCaptcha(token: string) {
  this.captcha = token;
  console.log('Captcha resuelto:', token);
}
}