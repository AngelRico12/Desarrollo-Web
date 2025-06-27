import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { AuthService } from '../../Services/Auth/auth.service';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    if (!this.authService.estaAutenticado()) {
      this.router.navigate(['/login']); // Cambia a tu ruta de login
      return false;
    }

    const usuario = this.authService.obtenerUsuario();
    if (!usuario) {
      this.router.navigate(['/login']);
      return false;
    }

    const allowedRoles = route.data['roles'] as Array<string>;
    if (allowedRoles && allowedRoles.includes(usuario.rol)) {
      return true;
    }

    // No autorizado por rol
    this.router.navigate(['/']);
    return false;
  }
}
