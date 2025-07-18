import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import API_URL from 'src/apiConfig';

@Component({
  selector: 'app-gestion-perfil',
  templateUrl: './gestion-perfil.component.html'
})
export class GestionPerfilComponent implements OnInit {
  API_URL = API_URL;

  usuario: {
    id_usuario: number;
    nombre: string;
    correo: string;
    contrasena: string;
  } = {
    id_usuario: 1,
    nombre: '',
    correo: '',
    contrasena: ''
  };

  copiaUsuario: {
    nombre: string;
    correo: string;
    contrasena: string;
  } = {
    nombre: '',
    correo: '',
    contrasena: ''
  };

  editando: {
    nombre: boolean;
    correo: boolean;
    contrasena: boolean;
  } = {
    nombre: false,
    correo: false,
    contrasena: false
  };

  mensaje: string = '';

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.obtenerPerfil();
  }

  obtenerPerfil() {
    this.http.get<any>(`${this.API_URL}/api/perfil/${this.usuario.id_usuario}`).subscribe(
      res => {
        if (res.success) {
          this.usuario = {
            id_usuario: res.usuario.id_usuario,
            nombre: res.usuario.nombre,
            correo: res.usuario.correo,
            contrasena: res.usuario.contrasena
          };
        }
      },
      error => console.error(error)
    );
  }

  activarEdicion(campo: 'nombre' | 'correo' | 'contrasena') {
    this.copiaUsuario[campo] = this.usuario[campo];
    this.editando[campo] = true;
    this.mensaje = '';
  }

  cancelarCampo(campo: 'nombre' | 'correo' | 'contrasena') {
    this.usuario[campo] = this.copiaUsuario[campo];
    this.editando[campo] = false;
  }

  guardarCampo(campo: 'nombre' | 'correo' | 'contrasena') {
    const valor = this.usuario[campo].trim();

    // Validar campo no vacío
    if (!valor) {
      this.mensaje = `El campo "${campo}" no puede estar vacío.`;
      return;
    }

    // Validación específica para correo
    if (campo === 'correo' && !this.validarCorreo(valor)) {
      this.mensaje = 'Correo inválido.';
      return;
    }

    // Aquí podrías agregar validación para contraseña si deseas
    if (campo === 'contrasena' && valor.length < 6) {
      this.mensaje = 'La contraseña debe tener al menos 6 caracteres.';
      return;
    }

    // Escapar caracteres especiales para evitar inyección XSS
    const datosActualizar = { [campo]: this.escapar(valor) };

    this.http.put<any>(`${this.API_URL}/api/perfil/${this.usuario.id_usuario}`, datosActualizar).subscribe(
      res => {
        if (res.success) {
          this.mensaje = `Campo "${campo}" actualizado correctamente.`;
          this.usuario[campo] = valor; // Guardar valor sin escapar en modelo (opcional, para mostrar limpio)
          this.editando[campo] = false;
        } else {
          this.mensaje = `No se pudo actualizar el campo "${campo}".`;
        }
      },
      error => {
        console.error(error);
        this.mensaje = `Error al actualizar el campo "${campo}".`;
      }
    );
  }

  // Función para validar correo con expresión regular
  validarCorreo(correo: string): boolean {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(correo);
  }

  // Función para escapar caracteres especiales y evitar XSS
  escapar(entrada: string): string {
    return entrada
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }
}
