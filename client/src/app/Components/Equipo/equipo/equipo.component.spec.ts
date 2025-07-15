import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { EquipoComponent } from './equipo.component';
import { AuthService } from '../../../Services/Auth/auth.service'; // Ajusta la ruta según tu proyecto
import { of } from 'rxjs';

describe('EquipoComponent', () => {
  let component: EquipoComponent;
  let fixture: ComponentFixture<EquipoComponent>;
  let httpMock: HttpTestingController;
  
  // Mock para authService
  const mockAuthService = {
    obtenerUsuario: jasmine.createSpy('obtenerUsuario')
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [EquipoComponent],
      imports: [HttpClientTestingModule],
      providers: [
        { provide: AuthService, useValue: mockAuthService }
      ]
    });

    fixture = TestBed.createComponent(EquipoComponent);
    component = fixture.componentInstance;
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify(); // Verifica que no haya peticiones pendientes
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('ngOnInit debe llamar a obtenerCategoriaYClub, obtenerIdUsuarioYHacerSolicitud y obtenerEquipoPorUsuario', () => {
    spyOn(component, 'obtenerCategoriaYClub');
    spyOn(component, 'obtenerIdUsuarioYHacerSolicitud');
    spyOn(component, 'obtenerEquipoPorUsuario');

    // Configuramos el mock para devolver un usuario con nombre e id_club
    mockAuthService.obtenerUsuario.and.returnValue({ nombre: 'Juan', id_club: 123 });

    component.ngOnInit();

    expect(component.obtenerCategoriaYClub).toHaveBeenCalled();
    expect(component.obtenerIdUsuarioYHacerSolicitud).toHaveBeenCalled();
    expect(component.obtenerEquipoPorUsuario).toHaveBeenCalled();
  });

  it('ngOnInit debe manejar caso sin usuario o sin nombre o sin id_club', () => {
    // Caso 1: no hay usuario
    mockAuthService.obtenerUsuario.and.returnValue(null);
    spyOn(console, 'error').and.callThrough();

    component.ngOnInit();
    expect(console.error).toHaveBeenCalledWith('No se pudo obtener el usuario desde el token.');

    // Caso 2: usuario sin nombre
    mockAuthService.obtenerUsuario.and.returnValue({ id_club: 5 });
    (console.error as jasmine.Spy).calls.reset();

    component.ngOnInit();
    expect(console.error).toHaveBeenCalledWith('El usuario no tiene un nombreUsuario asociado.');

    // Caso 3: usuario sin id_club
    mockAuthService.obtenerUsuario.and.returnValue({ nombre: 'Juan' });
    (console.error as jasmine.Spy).calls.reset();

    component.ngOnInit();
    expect(console.error).toHaveBeenCalledWith('El usuario no tiene un club asociado.');
  });

  it('ngOnInit debe procesar redes sociales si existen', () => {
    mockAuthService.obtenerUsuario.and.returnValue({ nombre: 'Juan', id_club: 123 });

    component.jugadorRecuperado = {
      redes_sociales: 'facebook:usuariofb - instagram:usuarioig'
    } as any;

    component.ngOnInit();

    expect(component.facebookLink).toBe('https://facebook.com/usuariofb');
    expect(component.instagramLink).toBe('https://instagram.com/usuarioig');
  });

  it('obtenerEquipoPorUsuario debe hacer GET y asignar equipo cuando hay usuario válido', () => {
    mockAuthService.obtenerUsuario.and.returnValue({ nombre: 'Juan' });
    component.API_URL = 'http://api.test';

    component.obtenerEquipoPorUsuario();

    const req = httpMock.expectOne('http://api.test/api/Ecategoria/equipoXU/Juan');
    expect(req.request.method).toBe('GET');

    req.flush({ success: true, equipo: { id_equipo: 1, nombre_equipo: 'Equipo1', colores: '', categoria: '', juegos_ganados: 0, juegos_perdidos: 0, cantidad_amonestaciones: 0, estado: '', nombre_dt: '' }, mensaje: '' });

    expect(component.equipo).toEqual({ id_equipo: 1, nombre_equipo: 'Equipo1', colores: '', categoria: '', juegos_ganados: 0, juegos_perdidos: 0, cantidad_amonestaciones: 0, estado: '', nombre_dt: '' });
  });

  it('obtenerEquipoPorUsuario debe manejar error de usuario inválido', () => {
    mockAuthService.obtenerUsuario.and.returnValue(null);
    spyOn(console, 'error');

    component.obtenerEquipoPorUsuario();
    expect(console.error).toHaveBeenCalledWith('No se pudo obtener el nombre de usuario desde el token');
  });

  it('obtenerEquipoPorUsuario debe manejar error HTTP', () => {
    mockAuthService.obtenerUsuario.and.returnValue({ nombre: 'Juan' });
    component.API_URL = 'http://api.test';
    spyOn(console, 'error');

    component.obtenerEquipoPorUsuario();

    const req = httpMock.expectOne('http://api.test/api/Ecategoria/equipoXU/Juan');
    req.error(new ErrorEvent('Network error'));

    expect(console.error).toHaveBeenCalledWith('Error al obtener el equipo:', jasmine.anything());
  });

  // Puedes seguir agregando tests similares para las otras funciones como obtenerCategoriaYClub, VerificarEquipoC, etc.
});
