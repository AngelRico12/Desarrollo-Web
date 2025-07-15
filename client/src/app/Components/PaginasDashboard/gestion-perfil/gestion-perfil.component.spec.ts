import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { GestionPerfilComponent } from './gestion-perfil.component';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

describe('GestionPerfilComponent', () => {
  let component: GestionPerfilComponent;
  let fixture: ComponentFixture<GestionPerfilComponent>;
  let httpMock: HttpTestingController;
  const API_URL = 'http://fakeapi.com';

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [GestionPerfilComponent],
      imports: [HttpClientTestingModule]
    }).compileComponents();

    fixture = TestBed.createComponent(GestionPerfilComponent);
    component = fixture.componentInstance;
    httpMock = TestBed.inject(HttpTestingController);

    component.API_URL = API_URL;
    fixture.detectChanges();
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('debe crear el componente', () => {
    expect(component).toBeTruthy();
  });

  it('ngOnInit llama a obtenerPerfil', () => {
    spyOn(component, 'obtenerPerfil');
    component.ngOnInit();
    expect(component.obtenerPerfil).toHaveBeenCalled();
  });

  it('obtenerPerfil asigna usuario cuando res.success es true', fakeAsync(() => {
    component.obtenerPerfil();
    const req = httpMock.expectOne(`${API_URL}/api/perfil/${component.usuario.id_usuario}`);
    expect(req.request.method).toBe('GET');
    req.flush({
      success: true,
      usuario: {
        id_usuario: 1,
        nombre: 'Juan',
        correo: 'juan@example.com',
        contrasena: '1234'
      }
    });
    tick();
    expect(component.usuario.nombre).toBe('Juan');
    expect(component.usuario.correo).toBe('juan@example.com');
  }));

  it('obtenerPerfil no cambia usuario si res.success es false', fakeAsync(() => {
    component.usuario.nombre = 'Original';
    component.obtenerPerfil();
    const req = httpMock.expectOne(`${API_URL}/api/perfil/${component.usuario.id_usuario}`);
    req.flush({ success: false });
    tick();
    expect(component.usuario.nombre).toBe('Original');
  }));

  it('activarEdicion copia valor y cambia estado de edición', () => {
    component.usuario.nombre = 'Juan';
    component.activarEdicion('nombre');
    expect(component.copiaUsuario.nombre).toBe('Juan');
    expect(component.editando.nombre).toBeTrue();
    expect(component.mensaje).toBe('');
  });

  it('cancelarCampo restaura valor y cambia estado de edición', () => {
    component.usuario.nombre = 'Nuevo';
    component.copiaUsuario.nombre = 'Original';
    component.editando.nombre = true;
    component.cancelarCampo('nombre');
    expect(component.usuario.nombre).toBe('Original');
    expect(component.editando.nombre).toBeFalse();
  });

  it('guardarCampo actualiza campo correctamente si éxito', fakeAsync(() => {
    component.usuario.nombre = 'NuevoNombre';
    component.editando.nombre = true;

    component.guardarCampo('nombre');

    const req = httpMock.expectOne(`${API_URL}/api/perfil/${component.usuario.id_usuario}`);
    expect(req.request.method).toBe('PUT');
    expect(req.request.body).toEqual({ nombre: 'NuevoNombre' });

    req.flush({ success: true });
    tick();

    expect(component.mensaje).toBe('Campo "nombre" actualizado correctamente.');
    expect(component.editando.nombre).toBeFalse();
  }));

  it('guardarCampo muestra mensaje error si no éxito', fakeAsync(() => {
    component.usuario.nombre = 'NuevoNombre';
    component.editando.nombre = true;

    component.guardarCampo('nombre');

    const req = httpMock.expectOne(`${API_URL}/api/perfil/${component.usuario.id_usuario}`);
    req.flush({ success: false });
    tick();

    expect(component.mensaje).toBe('No se pudo actualizar el campo "nombre".');
    expect(component.editando.nombre).toBeTrue();
  }));

  it('guardarCampo muestra mensaje error en caso de fallo HTTP', fakeAsync(() => {
    component.usuario.nombre = 'NuevoNombre';
    component.editando.nombre = true;

    component.guardarCampo('nombre');

    const req = httpMock.expectOne(`${API_URL}/api/perfil/${component.usuario.id_usuario}`);
    req.error(new ErrorEvent('Network error'));
    tick();

    expect(component.mensaje).toBe('Error al actualizar el campo "nombre".');
    expect(component.editando.nombre).toBeTrue();
  }));

});
