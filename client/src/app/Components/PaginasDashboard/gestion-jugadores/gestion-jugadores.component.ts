import { Component, OnInit } from '@angular/core';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { HttpClient } from '@angular/common/http';
import API_URL from 'src/apiConfig';

@Component({
  selector: 'app-gestion-jugadores',
  templateUrl: './gestion-jugadores.component.html'
})
export class GestionJugadoresComponent implements OnInit {

  jugadores: any[] = [];
  filtro: string = '';
  API_URL = API_URL;

  constructor(private http: HttpClient, private sanitizer: DomSanitizer) {}

  ngOnInit(): void {
    this.obtenerJugadores();
  }

  obtenerJugadores() {
    this.http.get<any>(`${this.API_URL}/api/jugadores/jugadores`).subscribe(
      res => {
        if (res.success) this.jugadores = res.jugadores;
      },
      err => console.error(err)
    );
  }

  eliminarJugador(id: number) {
    if (!confirm('¿Estás seguro de eliminar este jugador?')) return;
    this.http.delete(`${this.API_URL}/api/jugadores/jugadores/${id}`).subscribe(
      res => this.obtenerJugadores(),
      err => console.error(err)
    );
  }

  get jugadoresFiltrados() {
    return this.jugadores.filter(j =>
      j.nombre_completo.toLowerCase().includes(this.filtro.toLowerCase()) ||
      j.apodo.toLowerCase().includes(this.filtro.toLowerCase())
    );
  }

sanitizar(ruta: string): SafeUrl {
  const url = `${this.API_URL}${ruta.replace(/\\/g, '/')}`;
  return this.sanitizer.bypassSecurityTrustUrl(url);
}

}
