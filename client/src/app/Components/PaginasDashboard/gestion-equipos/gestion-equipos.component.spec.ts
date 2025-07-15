import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { GestionEquiposComponent } from './gestion-equipos.component';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

describe('GestionEquiposComponent', () => {
  let component: GestionEquiposComponent;
  let fixture: ComponentFixture<GestionEquiposComponent>;
  let httpMock: HttpTestingController;
  const API_URL = 'http://fakeapi.com';

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [GestionEquiposComponent],
      imports: [HttpClientTestingModule]
    }).compileComponents();

    fixture = TestBed.createComponent(GestionEquiposComponent);
    component = fixture.componentInstance;
    httpMock = TestBed.inject(HttpTestingController);

    // Sobrescribimos la URL para pruebas
    component.API_URL = API_URL;
    fixture.detectChanges();
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('debe crear el componente', () => {
    expect(component).toBeTruthy();
  });

  it('ngOnInit debe llamar obtenerEquipos', () => {
    spyOn(component, 'obtenerEquipos');
    component.ngOnInit();
    expect(component.obtenerEquipos).toHaveBeenCalled();
  });

  it('obtenerEquipos debe llenar equipos y categoriasUnicas', fakeAsync(() => {
    component.obtenerEquipos();
    const req = httpMock.expectOne(`${API_URL}/api/equipos/equipos`);
    expect(req.request.method).toBe('GET');
    req.flush({
      success: true,
      equipos: [
        { id_equipo: 1, nombre: 'Equipo A', categoria: 'Fútbol', estado: true },
        { id_equipo: 2, nombre: 'Equipo B', categoria: 'Béisbol', estado: false },
      ]
    });
    tick();
    expect(component.equipos.length).toBe(2);
    expect(component.categoriasUnicas).toEqual(['Fútbol', 'Béisbol']);
    expect(component.equiposFiltrados.length).toBe(2);
  }));

  it('filtrarEquipos debe filtrar equipos correctamente', () => {
    component.equipos = [
      { nombre: 'Equipo A', categoria: 'Fútbol' },
      { nombre: 'Equipo B', categoria: 'Béisbol' },
      { nombre: 'Alpha Team', categoria: 'Fútbol' }
    ];
    component.busqueda = 'equipo';
    component.filtroCategoria = 'Fútbol';

    component.filtrarEquipos();

    expect(component.equiposFiltrados.length).toBe(1);
    expect(component.equiposFiltrados[0].nombre).toBe('Equipo A');
  });

  it('cambiarEstado debe mostrar mensaje de éxito', fakeAsync(() => {
    const equipo = { id_equipo: 1, estado: true };
    component.cambiarEstado(equipo);

    const req = httpMock.expectOne(`${API_URL}/api/equipos/equipos/1/estado`);
    expect(req.request.method).toBe('PUT');
    req.flush({ success: true });

    tick();

    expect(component.mensaje).toBe('Estado actualizado correctamente.');
  }));

  it('cambiarEstado debe mostrar mensaje de error', fakeAsync(() => {
    const equipo = { id_equipo: 1, estado: true };
    component.cambiarEstado(equipo);

    const req = httpMock.expectOne(`${API_URL}/api/equipos/equipos/1/estado`);
    req.flush({ success: false });

    tick();

    expect(component.mensaje).toBe('Error al actualizar estado.');
  }));

  it('eliminarEquipo cancela si no confirma', () => {
    spyOn(window, 'confirm').and.returnValue(false);
    component.eliminarEquipo(1);
    // No debe hacer nada, equipos no cambia
    expect(component.mensaje).toBe('');
  });

  it('eliminarEquipo elimina y actualiza la lista', fakeAsync(() => {
    component.equipos = [
      { id_equipo: 1, nombre: 'Equipo A' },
      { id_equipo: 2, nombre: 'Equipo B' }
    ];
    spyOn(window, 'confirm').and.returnValue(true);

    component.eliminarEquipo(1);

    const req = httpMock.expectOne(`${API_URL}/api/equipos/equipos/1`);
    expect(req.request.method).toBe('DELETE');
    req.flush({ success: true });

    tick();

    expect(component.mensaje).toBe('Equipo eliminado correctamente.');
    expect(component.equipos.length).toBe(1);
    expect(component.equipos[0].id_equipo).toBe(2);
  }));

  it('eliminarEquipo muestra mensaje de error al fallar', fakeAsync(() => {
    spyOn(window, 'confirm').and.returnValue(true);
    component.eliminarEquipo(1);

    const req = httpMock.expectOne(`${API_URL}/api/equipos/equipos/1`);
    req.flush({ success: false });

    tick();

    expect(component.mensaje).toBe('No se pudo eliminar el equipo.');
  }));

});
