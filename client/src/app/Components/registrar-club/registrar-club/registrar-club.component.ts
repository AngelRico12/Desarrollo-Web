import { Component } from '@angular/core';
import { ClubService } from '../../../Services/registrar-club/registrar-club.service';
import { NgForm } from '@angular/forms';

import { VerificaCorreoService } from '../../../Services/VerificaCorreo/verifica-correo.service';
import { AfterViewInit } from '@angular/core';
declare var bootstrap: any; // Importa Bootstrap globalmente

@Component({
  selector: 'app-registrar-club',
  templateUrl: './registrar-club.component.html',
  standalone: false
})
export class RegistrarClubComponent {

avisoAceptado: boolean = false;


  nombre: string = '';
  correo: string = '';
  certificado: File | null = null;
  logotipo: File | null = null;
  captcha: string = '';

  correoValido: boolean | null = null; // null: no validado aún


  constructor(private clubService: ClubService, private verificaCorreoService: VerificaCorreoService) {}

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

  resolvedCaptcha(token: string) {
  this.captcha = token;
  console.log('Captcha resuelto:', token);
}



verificarCorreoEnTiempoReal() {
  console.log('Validando correo:', this.correo);

  if (!this.correo) return;

  this.verificaCorreoService.verificarCorreo(this.correo).subscribe({
    next: (res) => {
      console.log('Respuesta API:', res);
      const formato = res.is_valid_format?.value ?? false;
      const smtp = res.is_smtp_valid?.value ?? false;
      const mx = res.is_mx_found?.value ?? false;

      this.correoValido = formato && smtp && mx;
      console.log('Correo válido:', this.correoValido);
    },
    error: (err) => {
      console.error('Error al verificar correo:', err);
      this.correoValido = false;
    }
  });
}


  onSubmit(form: NgForm): void {
  if (form.invalid) {
    alert('Formulario inválido. Revisa los campos obligatorios.');
    return;
  }

  if (!this.certificado) {
    alert('Debes subir el certificado (PDF, PNG o JPG).');
    return;
  }

  if (!this.logotipo) {
    alert('Debes subir el logotipo (solo PNG).');
    return;
  }

  if (!this.captcha) {
    alert('Debes completar el CAPTCHA.');
    return;
  }

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
      }
    });
}

}
