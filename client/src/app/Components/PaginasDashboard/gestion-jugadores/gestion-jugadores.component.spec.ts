import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { GestionJugadoresComponent } from './gestion-jugadores.component';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { DomSanitizer } from '@angular/platform-browser';

describe('GestionJugadoresComponent', () => {
  let component: GestionJugadoresComponent;
  let fixture: ComponentFixture<GestionJugadoresComponent>;
  let httpMock: HttpTestingController;
  let sanitizer: DomSanitizer;
  const API_URL = 'http://fakeapi.com';

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [GestionJugadoresComponent],
      imports: [HttpClientTestingModule]
    }).compileComponents();

    fixture = TestBed.createComponent(GestionJugadoresComponent);
    component = fixture.componentInstance;
    httpMock = TestBed.inject(HttpTestingController);
    sanitizer = TestBed.inject(DomSanitizer);

    component.API_URL = API_URL;
    fixture.detectChanges();
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('debe crear el componente', () => {
    expect(component).toBeTruthy();
  });

  it('ngOnInit debe llamar obtenerJugadores', () => {
    spyOn(component, 'obtenerJugadores');
    component.ngOnInit();
    expect(component.obtenerJugadores).toHaveBeenCalled();
  });

  it('obtenerJugadores debe asignar jugadores si success es true', fakeAsync(() => {
    component.obtenerJugadores();
    const req = httpMock.expectOne(`${API_URL}/api/jugadores/jugadores`);
    expect(req.request.method).toBe('GET');
    req.flush({ success: true, jugadores: [{ id: 1, nombre_completo: 'Juan Pérez', apodo: 'JP' }] });
    tick();
    expect(component.jugadores.length).toBe(1);
  }));

  it('obtenerJugadores no asigna jugadores si success es false', fakeAsync(() => {
    component.obtenerJugadores();
    const req = httpMock.expectOne(`${API_URL}/api/jugadores/jugadores`);
    req.flush({ success: false });
    tick();
    expect(component.jugadores.length).toBe(0);
  }));

  it('eliminarJugador no hace nada si confirma es false', () => {
    spyOn(window, 'confirm').and.returnValue(false);
    component.eliminarJugador(1);
    httpMock.expectNone(`${API_URL}/api/jugadores/jugadores/1`);
  });

  it('eliminarJugador llama a obtenerJugadores tras eliminar', fakeAsync(() => {
    spyOn(window, 'confirm').and.returnValue(true);
    spyOn(component, 'obtenerJugadores');

    component.eliminarJugador(1);
    const req = httpMock.expectOne(`${API_URL}/api/jugadores/jugadores/1`);
    expect(req.request.method).toBe('DELETE');
    req.flush({});
    tick();

    expect(component.obtenerJugadores).toHaveBeenCalled();
  }));

  it('jugadoresFiltrados filtra por nombre_completo y apodo', () => {
    component.jugadores = [
      { nombre_completo: 'Juan Pérez', apodo: 'JP' },
      { nombre_completo: 'Ana García', apodo: 'Anita' },
      { nombre_completo: 'Carlos López', apodo: 'Carl' }
    ];

    component.filtro = 'juan';
    expect(component.jugadoresFiltrados.length).toBe(1);
    expect(component.jugadoresFiltrados[0].nombre_completo).toBe('Juan Pérez');

    component.filtro = 'an';
    expect(component.jugadoresFiltrados.length).toBe(2);

    component.filtro = 'xyz';
    expect(component.jugadoresFiltrados.length).toBe(0);
  });

  it('sanitizar devuelve url sanitizada', () => {
    const ruta = '/uploads/foto.png';
    const safeUrl = component.sanitizar(ruta) as any;
    expect(safeUrl.changingThisBreaksApplicationSecurity).toContain('/uploads/foto.png');
  });

});
