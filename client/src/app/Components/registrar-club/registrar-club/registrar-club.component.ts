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
    this.certificado = event.target.files[0];
  }

  // Manejar cambio de archivo para logotipo
  onLogotipoChange(event: any): void {
    this.logotipo = event.target.files[0];
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
