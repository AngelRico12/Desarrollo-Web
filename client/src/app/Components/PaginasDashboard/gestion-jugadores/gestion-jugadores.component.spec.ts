import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { GestionJugadoresComponent } from './gestion-jugadores.component';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { DomSanitizer } from '@angular/platform-browser';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import API_URL from 'src/apiConfig';

describe('GestionJugadoresComponent', () => {
  let component: GestionJugadoresComponent;
  let fixture: ComponentFixture<GestionJugadoresComponent>;
  let httpMock: HttpTestingController;
  let sanitizer: DomSanitizer;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [GestionJugadoresComponent],
      imports: [HttpClientTestingModule],
      schemas: [NO_ERRORS_SCHEMA], // Ignorar plantillas
    }).compileComponents();

    fixture = TestBed.createComponent(GestionJugadoresComponent);
    component = fixture.componentInstance;
    httpMock = TestBed.inject(HttpTestingController);
    sanitizer = TestBed.inject(DomSanitizer);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('debe crearse el componente', () => {
    expect(component).toBeTruthy();
  });

  it('debe llamar obtenerJugadores al iniciar', () => {
    spyOn(component, 'obtenerJugadores');
    component.ngOnInit();
    expect(component.obtenerJugadores).toHaveBeenCalled();
  });

  it('debe obtener jugadores desde el API', () => {
    const mockResponse = { success: true, jugadores: [{ nombre_completo: 'Juan Pérez', apodo: 'JP' }] };
    component.obtenerJugadores();

    const req = httpMock.expectOne(`${API_URL}/api/jugadores/jugadores`);
    expect(req.request.method).toBe('GET');
    req.flush(mockResponse);

    expect(component.jugadores.length).toBe(1);
    expect(component.jugadores[0].nombre_completo).toBe('Juan Pérez');
  });

  it('debe filtrar jugadores correctamente', () => {
    component.jugadores = [
      { nombre_completo: 'Juan Pérez', apodo: 'JP' },
      { nombre_completo: 'Luis Gómez', apodo: 'Lucho' }
    ];
    component.filtro = 'juan';
    const filtrados = component.jugadoresFiltrados;
    expect(filtrados.length).toBe(1);
    expect(filtrados[0].nombre_completo).toBe('Juan Pérez');
  });

  it('debe eliminar jugador tras confirmación', fakeAsync(() => {
    spyOn(window, 'confirm').and.returnValue(true);
    const mockResponse = { success: true };

    spyOn(component, 'obtenerJugadores');
    component.eliminarJugador(1);

    const req = httpMock.expectOne(`${API_URL}/api/jugadores/jugadores/1`);
    expect(req.request.method).toBe('DELETE');
    req.flush(mockResponse);

    tick();
    expect(component.obtenerJugadores).toHaveBeenCalled();
  }));

  it('no debe eliminar jugador si se cancela confirmación', () => {
    spyOn(window, 'confirm').and.returnValue(false);
    const spyHttp = spyOn(component['http'], 'delete');
    component.eliminarJugador(1);
    expect(spyHttp).not.toHaveBeenCalled();
  });

  it('debe sanitizar una URL correctamente', () => {
    const rawRuta = '/uploads/jugador.jpg';
    const safeUrl = component.sanitizar(rawRuta);
    expect(safeUrl).toBeTruthy();
    expect(sanitizer.bypassSecurityTrustUrl(`${API_URL}/uploads/jugador.jpg`)).toEqual(safeUrl);
  });
});
