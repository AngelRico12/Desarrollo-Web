import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { jwtDecode } from 'jwt-decode';

import API_URL from 'src/apiConfig';

interface JwtPayload {
  id_usuario: number;
  nombre: string;
  correo: string;
  rol: string;
  exp: number; // expiración en timestamp
  iat: number;
  id_club?: number;
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrl = `${API_URL}/api/auth/login`;
  private tokenKey = 'token';

  constructor(private http: HttpClient) {}

  login(
    correo: string,
    contraseña: string
  ): Observable<{ success: boolean; token?: string; correoIntentado?: string; message?: string }> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    const body = { correo, contraseña };

    return this.http.post<{ success: boolean; token?: string; correoIntentado?: string; message?: string }>(this.apiUrl, body, { headers }).pipe(
      map((response) => {
        if (response.success && response.token) {
          this.guardarToken(response.token);
          return { success: true, token: response.token };
        }
        // No se pasa el mensaje crudo, sólo uno genérico
        return {
          success: false,
          correoIntentado: response.correoIntentado,
          message: 'Correo o contraseña incorrectos.' // Mensaje genérico
        };
      }),
      catchError((err) => {
        // Aquí puedes registrar el error con algún logger si tienes backend logging
        // pero para el usuario sólo devuelves mensaje genérico
        return of({
          success: false,
          correoIntentado: undefined,
          message: 'Ocurrió un error al procesar la solicitud. Por favor, intente más tarde.'
        });
      })
    );
  }

  guardarToken(token: string): void {
    localStorage.setItem(this.tokenKey, token);
  }

  obtenerToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  eliminarToken(): void {
    localStorage.removeItem(this.tokenKey);
  }

  estaAutenticado(): boolean {
    const token = this.obtenerToken();
    if (!token) return false;

    try {
      const payload = jwtDecode<JwtPayload>(token);
      return payload.exp * 1000 > Date.now();
    } catch {
      return false;
    }
  }

  obtenerUsuario(): JwtPayload | null {
    const token = this.obtenerToken();
    if (!token) return null;

    try {
      return jwtDecode<JwtPayload>(token);
    } catch {
      return null;
    }
  }

  logout(): void {
    this.eliminarToken();
  }
}
