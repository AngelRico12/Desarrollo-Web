import { Component } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs';
import { AuthService } from 'src/app/Services/Auth/auth.service'; // Asegúrate de que esta ruta sea correcta

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css'],
  standalone: false
})
export class NavbarComponent {

  dropdownAbierto = false;

  isLoggedIn = false;
  usuario: any = null;
  rol: string = '';

  constructor(private router: Router, private authService: AuthService) {
    // Escuchar cambios de navegación para actualizar el estado de sesión
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe(() => {
      this.actualizarEstadoUsuario();
    });
  }

  ngOnInit(): void {
    this.actualizarEstadoUsuario();
  }

  actualizarEstadoUsuario(): void {
    this.isLoggedIn = this.authService.estaAutenticado();
    const payload = this.authService.obtenerUsuario();

    if (this.isLoggedIn && payload) {
      this.usuario = payload;
      this.rol = payload.rol;
    } else {
      this.usuario = null;
      this.rol = '';
    }
  }

  logout(): void {
    this.authService.logout();
    this.isLoggedIn = false;
    this.usuario = null;
    this.rol = '';
    this.router.navigate(['/']);
  }
}
