import { Component } from '@angular/core';
import { ClubService } from '../../../Services/registrar-club/registrar-club.service';
import { AfterViewInit } from '@angular/core';
declare var bootstrap: any; // Importa Bootstrap globalmente

@Component({
  selector: 'app-registrar-club',
  templateUrl: './registrar-club.component.html',
  standalone: false
})
export class RegistrarClubComponent {
  nombre: string = '';
  correo: string = '';
  certificado: File | null = null;
  logotipo: File | null = null;

  constructor(private clubService: ClubService) {}

    ngAfterViewInit(): void {
    const tooltipTriggerList = Array.from(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
    tooltipTriggerList.forEach((tooltipTriggerEl) => {
      new bootstrap.Tooltip(tooltipTriggerEl);
    });
  }

  // Manejar cambio de archivo para certificado
  onCertificadoChange(event: any): void {
    const file = event.target.files[0];
    const validTypes = ['application/pdf', 'image/png', 'image/jpeg'];

    if (file) {
      if (!validTypes.includes(file.type)) {
        alert('Solo se permite subir archivos PDF, PNG o JPG para el certificado.');
        this.certificado = null;
        event.target.value = '';
        return;
      }

      if (file.size > 2 * 1024 * 1024) {
        alert('El archivo del certificado supera el tamaño máximo de 2MB.');
        this.certificado = null;
        event.target.value = '';
        return;
      }

      this.certificado = file;
    }
  }


  // Manejar cambio de archivo para logotipo
  onLogotipoChange(event: any): void {
    const file = event.target.files[0];
    const validTypes = ['image/png'];

    if (file) {
      if (!validTypes.includes(file.type)) {
        alert('Solo se permite subir imágenes PNG para el logotipo.');
        this.logotipo = null;
        event.target.value = '';
        return;
      }

      if (file.size > 2 * 1024 * 1024) {
        alert('El archivo del logotipo supera el tamaño máximo de 2MB.');
        this.logotipo = null;
        event.target.value = '';
        return;
      }

      this.logotipo = file;
    }
  }


  onSubmit(): void {
    if (this.nombre && this.correo && this.certificado && this.logotipo) {
      this.clubService
        .registerClub(this.nombre, this.correo, this.certificado, this.logotipo)
        .subscribe({
          next: (response) => {
            if (response.success) {
              alert('Club registrado exitosamente!');
            } else {
              alert(`Error: ${response.message}`);
            }
          },
          error: (err) => {
            console.error('Error en el registro:', err);
            alert('Hubo un error al registrar el club.');
          },
        });
    } else {
      alert('Por favor, complete todos los campos.');
    }
  }
}
