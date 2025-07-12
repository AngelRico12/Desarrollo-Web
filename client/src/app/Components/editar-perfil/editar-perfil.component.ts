
import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http'
import { AuthService} from '../../Services/Auth/auth.service';

import API_URL from 'src/apiConfig';

@Component({
  selector: 'app-editar-perfil',
  templateUrl: './editar-perfil.component.html',
  styleUrls: ['./editar-perfil.component.css']
})
export class EditarPerfilComponent {

  API_URL = API_URL;

  club: any = {};
  contrasena: string = '';
  logotipoFile: File | null = null;
  cargando = false;

  id_club!: number;

  editando: any = {
  nombre: false,
  correo: false,
  contraseña: false,
  logotipo: false
};

originalClub: any = {}; // Para restaurar en caso de cancelar


  constructor(private http: HttpClient, private authService: AuthService) {}


  ngOnInit(): void {
  const usuario = this.authService.obtenerUsuario();
  if (usuario && usuario.id_club) {
    this.id_club = usuario.id_club;
    this.obtenerDatosClub();
  } else {
    console.error('No se pudo obtener el id_club del usuario');
  }
}


  obtenerDatosClub() {
    this.http.get(`${this.API_URL}/api/club2/club/${this.id_club}`).subscribe({
      next: (res: any) => {
        this.club = res.club;
      },
      error: (err) => {
        console.error('Error al cargar datos del club:', err);
      },
    });
  }

  onFileChange(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.logotipoFile = input.files[0];
    }
  }

  guardarCambios() {
    this.cargando = true;

    const formData = new FormData();
    formData.append('nombre', this.club.nombre);
    formData.append('correo', this.club.correo);

    if (this.contrasena.trim() !== '') {
      formData.append('contraseña', this.contrasena);
    }

    if (this.logotipoFile) {
      formData.append('logotipo', this.logotipoFile);
    }

    this.http.put(`${this.API_URL}/api/club2/club/${this.id_club}`, formData).subscribe({
      next: (res: any) => {
        alert('Cambios guardados con éxito.');
        this.obtenerDatosClub(); // refrescar datos
        this.contrasena = '';
        this.logotipoFile = null;
        this.cargando = false;
      },
      error: (err) => {
        console.error('Error al guardar cambios:', err);
        alert('Error al guardar los cambios.');
        this.cargando = false;
      },
    });
  }

  solicitarBaja() {
    if (!confirm('¿Estás seguro de que deseas solicitar la baja del sistema?')) return;

    this.cargando = true;
    this.http.post(`${this.API_URL}/api/club2/club/${this.id_club}/baja`, {}).subscribe({
      next: (res: any) => {
        alert('La solicitud de baja fue enviada correctamente.');
        this.cargando = false;
      },
      error: (err) => {
        console.error('Error al solicitar baja:', err);
        alert('Error al enviar la solicitud de baja.');
        this.cargando = false;
      },
    });
  }

  activarEdicion(campo: string) {
  this.editando[campo] = true;
  this.originalClub[campo] = this.club[campo]; // Guardamos el valor anterior por si cancelan
}

cancelarCampo(campo: string) {
  this.editando[campo] = false;
  this.club[campo] = this.originalClub[campo]; // Restauramos valor
  if (campo === 'contraseña') this.contrasena = '';
  if (campo === 'logotipo') this.logotipoFile = null;
}

guardarCampo(campo: string) {
  const formData = new FormData();

  if (campo === 'nombre') {
    formData.append('nombre', this.club.nombre);
  } else if (campo === 'correo') {
    formData.append('correo', this.club.correo);
  } else if (campo === 'contraseña') {
    if (this.contrasena.trim() === '') {
      alert('La contraseña no puede estar vacía.');
      return;
    }
    formData.append('contraseña', this.contrasena);
  } else if (campo === 'logotipo') {
    if (!this.logotipoFile) {
      alert('Selecciona un archivo de logotipo.');
      return;
    }
    formData.append('logotipo', this.logotipoFile);
  }

  this.cargando = true;

  this.http.put(`${this.API_URL}/api/club2/club/${this.id_club}`, formData).subscribe({
    next: (res: any) => {
      this.editando[campo] = false;

      // Si se actualizó la contraseña, limpiamos el campo
      if (campo === 'contraseña') {
        this.contrasena = '';
      }

      // Si se actualizó el logotipo, refrescamos el club para obtener el nuevo logotipo URL
      if (campo === 'logotipo') {
        this.obtenerDatosClub();
        this.logotipoFile = null;
      }

      this.cargando = false;
      alert('Campo actualizado con éxito.');
    },
    error: (err) => {
      console.error(`Error al guardar campo ${campo}:`, err);
      alert(`Error al guardar ${campo}.`);
      this.cargando = false;
    },
  });
}

}
