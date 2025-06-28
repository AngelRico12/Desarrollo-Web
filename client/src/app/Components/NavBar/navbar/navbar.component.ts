import { Component } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css'],
  standalone: false
})
export class NavbarComponent {
  searchQuery: string = '';

  dropdownAbierto = false;
  isLoggedIn = false;
  usuario: any = null;
  rol: string = '';

  constructor(private router: Router) {
    // Escuchar cambios en las rutas para actualizar el estado de la sesión
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe(() => {
      this.checkUser();
    });
  }

  ngOnInit(): void {
    this.checkUser();
  }

  checkUser() {
    const storedUser = localStorage.getItem('usuario');
    if (storedUser) {
      this.usuario = JSON.parse(storedUser);
      this.rol = this.usuario.rol;
      this.isLoggedIn = true;
    } else {
      this.isLoggedIn = false;
      this.usuario = null;
    }
  }

  logout(): void {
    localStorage.removeItem('usuario');
    this.isLoggedIn = false;
    this.usuario = null;
    window.location.reload();
    this.router.navigate(['/']);
  }

  buscar(): void {
    const query = this.searchQuery.toLowerCase().trim();

    const rutas = [
      { keywords: ['registrar club', 'nuevo club', 'registro club', 'Registrar', 'registrar'], ruta: '/Rclub' },
      { keywords: ['iniciar sesión','iniciar sesion',  'login', 'entrar'], ruta: '/login' },
      { keywords: ['administrar', 'dueño', 'administrador sistema'], ruta: '/dueno' },
      { keywords: ['equipo', 'mi equipo'], ruta: '/equipo' },
      { keywords: ['editar usuario', 'perfil', 'editar'], ruta: '/editar-usuario' },
      { keywords: ['inicio', 'home'], ruta: '/inicio' },
      { keywords: ['mapa del sitio', 'mapa'], ruta: '/mapa-sitio' },
      { keywords: ['preguntas frecuentes', 'faq', 'ayuda'], ruta: '/inicio', fragment: 'preguntas-frecuentes' }

    ];

    const resultado = rutas.find(entry =>
      entry.keywords.some(keyword => query.includes(keyword))
    );

      if (resultado) {
    this.router.navigate([resultado.ruta], {
      fragment: resultado.fragment || undefined
    });
  } else {
    // Redirigir a pantalla 404 personalizada
    this.router.navigate(['/pagina-no-encontrada'], { queryParams: { q: this.searchQuery } });
  }
  }
}
