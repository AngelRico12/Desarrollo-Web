import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

const API_KEY = '13f7831d686e495c8c608b46e099869b';

@Injectable({
  providedIn: 'root'
})
export class VerificaCorreoService {
  constructor(private http: HttpClient) {}

  verificarCorreo(correo: string): Observable<any> {
    const url = `https://emailvalidation.abstractapi.com/v1/?api_key=${API_KEY}&email=${correo}`;
    return this.http.get<any>(url);
  }
}
