import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import API_URL from 'src/apiConfig';

@Component({
  selector: 'app-gestion-perfil',
  templateUrl: './gestion-perfil.component.html'
})
export class GestionPerfilComponent implements OnInit {
  API_URL = API_URL;

  // Tipado explícito
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

  // Copia temporal con mismo tipo
  copiaUsuario: {
    nombre: string;
    correo: string;
    contrasena: string;
  } = {
    nombre: '',
    correo: '',
    contrasena: ''
  };

  // Estado de edición, tipado explícito
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
    const datosActualizar = { [campo]: this.usuario[campo] };

    this.http.put<any>(`${this.API_URL}/api/perfil/${this.usuario.id_usuario}`, datosActualizar).subscribe(
      res => {
        if (res.success) {
          this.mensaje = `Campo "${campo}" actualizado correctamente.`;
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
}
