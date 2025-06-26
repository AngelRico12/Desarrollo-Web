import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import API_URL from 'src/apiConfig';

@Component({
  selector: 'app-gestion-equipos',
  templateUrl: './gestion-equipos.component.html'
})
export class GestionEquiposComponent implements OnInit {
  API_URL = API_URL;

  equipos: any[] = [];
  equiposFiltrados: any[] = [];
  busqueda: string = '';
  filtroCategoria: string = '';
  mensaje: string = '';

  categoriasUnicas: string[] = [];

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.obtenerEquipos();
  }

  obtenerEquipos(): void {
    this.http.get<any>(`${this.API_URL}/api/equipos/equipos`).subscribe(
      res => {
        if (res.success) {
          this.equipos = res.equipos;
          this.filtrarEquipos();
          this.categoriasUnicas = [...new Set(this.equipos.map(e => e.categoria))];
        }
      },
      error => console.error(error)
    );
  }

  filtrarEquipos(): void {
    this.equiposFiltrados = this.equipos.filter(e =>
      e.nombre.toLowerCase().includes(this.busqueda.toLowerCase()) &&
      (!this.filtroCategoria || e.categoria === this.filtroCategoria)
    );
  }

  cambiarEstado(equipo: any): void {
    const body = { estado: equipo.estado };

    this.http.put<any>(`${this.API_URL}/api/equipos/equipos/${equipo.id_equipo}/estado`, body).subscribe(
      res => {
        if (res.success) {
          this.mensaje = 'Estado actualizado correctamente.';
        } else {
          this.mensaje = 'Error al actualizar estado.';
        }
      },
      error => {
        console.error(error);
        this.mensaje = 'Error de servidor al cambiar estado.';
      }
    );
  }

  eliminarEquipo(id: number): void {
    if (!confirm('¿Estás seguro de eliminar este equipo?')) return;

    this.http.delete<any>(`${this.API_URL}/api/equipos/equipos/${id}`).subscribe(
      res => {
        if (res.success) {
          this.mensaje = 'Equipo eliminado correctamente.';
          this.equipos = this.equipos.filter(e => e.id_equipo !== id);
          this.filtrarEquipos();
        } else {
          this.mensaje = 'No se pudo eliminar el equipo.';
        }
      },
      error => {
        console.error(error);
        this.mensaje = 'Error de servidor al eliminar equipo.';
      }
    );
  }
}
