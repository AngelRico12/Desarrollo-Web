import { Component } from '@angular/core';
import { ClubService } from '../../../Services/registrar-club/registrar-club.service';
import { NgForm } from '@angular/forms';

import { VerificaCorreoService } from '../../../Services/VerificaCorreo/verifica-correo.service';

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
  captcha: string = '';

  correoValido: boolean | null = null; // null: no validado aún


  constructor(private clubService: ClubService, private verificaCorreoService: VerificaCorreoService) {}

  // Manejar cambio de archivo para certificado
  onCertificadoChange(event: any): void {
    this.certificado = event.target.files[0];
  }

  // Manejar cambio de archivo para logotipo
  onLogotipoChange(event: any): void {
    this.logotipo = event.target.files[0];
  }

  resolvedCaptcha(token: string) {
  this.captcha = token;
  console.log('Captcha resuelto:', token);
}


  onSubmit(form: NgForm): void {
  if (form.invalid || !this.certificado || !this.logotipo || !this.captcha) {
    alert('Formulario inválido. Revisa los campos.');
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
      },
    });
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



}
