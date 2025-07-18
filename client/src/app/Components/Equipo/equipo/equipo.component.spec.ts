import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { EquipoComponent } from './equipo.component';
import { AuthService } from '../../../Services/Auth/auth.service';

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
      providers: [{ provide: AuthService, useValue: mockAuthService }]
    });

    fixture = TestBed.createComponent(EquipoComponent);
    component = fixture.componentInstance;
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    // Verifica que no haya peticiones pendientes sin resolver
    httpMock.verify();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('ngOnInit debe llamar a obtenerCategoriaYClub, obtenerIdUsuarioYHacerSolicitud y obtenerEquipoPorUsuario', () => {
    spyOn(component, 'obtenerCategoriaYClub').and.callThrough();
    spyOn(component, 'obtenerIdUsuarioYHacerSolicitud').and.callThrough();
    spyOn(component, 'obtenerEquipoPorUsuario').and.callThrough();

    mockAuthService.obtenerUsuario.and.returnValue({ nombre: 'Juan', id_club: 123 });
    component.API_URL = 'https://localhost:3000';

    component.ngOnInit();

    // Mock todas las peticiones HTTP que realiza ngOnInit
    const reqCategorias = httpMock.match('https://localhost:3000/api/Ecategoria/categoria-usuario/Juan');
    expect(reqCategorias.length).toBe(2);
    reqCategorias.forEach(req => req.flush({ success: true, categoria: 'categoria-mock' }));

    const reqClub = httpMock.expectOne('https://localhost:3000/api/clubes/123');
    expect(reqClub.request.method).toBe('GET');
    reqClub.flush({ success: true, club: { id: 123, nombre: 'Club Mock' } });

    const reqEquipo = httpMock.expectOne('https://localhost:3000/api/Ecategoria/equipoXU/Juan');
    expect(reqEquipo.request.method).toBe('GET');
    reqEquipo.flush({ success: true, equipo: { id_equipo: 1, nombre_equipo: 'Equipo1' }, mensaje: '' });

    const reqIdEquipo = httpMock.expectOne('https://localhost:3000/api/Ecategoria/id-equipo/Juan');
    expect(reqIdEquipo.request.method).toBe('GET');
    reqIdEquipo.flush({ success: true, id_equipo: 1 });

    const reqEstadoEquipo = httpMock.expectOne('https://localhost:3000/api/Ecategoria/estadoEquipo/1');
    expect(reqEstadoEquipo.request.method).toBe('GET');
    reqEstadoEquipo.flush({ success: true, estado: 'activo' });

    expect(component.obtenerCategoriaYClub).toHaveBeenCalled();
    expect(component.obtenerIdUsuarioYHacerSolicitud).toHaveBeenCalled();
    expect(component.obtenerEquipoPorUsuario).toHaveBeenCalled();
  });

it('ngOnInit debe manejar caso sin usuario o sin nombre o sin id_club', () => {
  spyOn(console, 'error');

  // Caso 1: no hay usuario
  mockAuthService.obtenerUsuario.and.returnValue(null);
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
    component.API_URL = 'https://localhost:3000';

    component.jugadorRecuperado = {
      redes_sociales: 'facebook:usuariofb - instagram:usuarioig'
    } as any;

    component.ngOnInit();

    const reqCategorias = httpMock.match('https://localhost:3000/api/Ecategoria/categoria-usuario/Juan');
    expect(reqCategorias.length).toBe(2);
    reqCategorias.forEach(req => req.flush({ success: true, categoria: 'categoria-mock' }));

    const reqClub = httpMock.expectOne('https://localhost:3000/api/clubes/123');
    reqClub.flush({ success: true, club: { id: 123, nombre: 'Club Mock' } });

    const reqEquipo = httpMock.expectOne('https://localhost:3000/api/Ecategoria/equipoXU/Juan');
    reqEquipo.flush({ success: true, equipo: { id_equipo: 1, nombre_equipo: 'Equipo1' }, mensaje: '' });

    const reqIdEquipo = httpMock.expectOne('https://localhost:3000/api/Ecategoria/id-equipo/Juan');
    reqIdEquipo.flush({ success: true, id_equipo: 1 });

    const reqEstadoEquipo = httpMock.expectOne('https://localhost:3000/api/Ecategoria/estadoEquipo/1');
    reqEstadoEquipo.flush({ success: true, estado: 'activo' });

    expect(component.facebookLink).toBe('https://facebook.com/usuariofb');
    expect(component.instagramLink).toBe('https://instagram.com/usuarioig');
  });

  it('obtenerEquipoPorUsuario debe hacer GET y asignar equipo cuando hay usuario válido', () => {
    mockAuthService.obtenerUsuario.and.returnValue({ nombre: 'Juan' });
    component.API_URL = 'http://api.test';

    component.obtenerEquipoPorUsuario();

    const req = httpMock.expectOne('http://api.test/api/Ecategoria/equipoXU/Juan');
    expect(req.request.method).toBe('GET');

    req.flush({
      success: true,
      equipo: {
        id_equipo: 1,
        nombre_equipo: 'Equipo1',
        colores: '',
        categoria: '',
        juegos_ganados: 0,
        juegos_perdidos: 0,
        cantidad_amonestaciones: 0,
        estado: '',
        nombre_dt: ''
      },
      mensaje: ''
    });

    expect(component.equipo).toEqual({
      id_equipo: 1,
      nombre_equipo: 'Equipo1',
      colores: '',
      categoria: '',
      juegos_ganados: 0,
      juegos_perdidos: 0,
      cantidad_amonestaciones: 0,
      estado: '',
      nombre_dt: ''
    });
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
});
