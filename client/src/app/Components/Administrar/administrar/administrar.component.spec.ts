import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { AdministrarComponent } from './administrar.component';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { Router } from '@angular/router';


// Mock para Router
class RouterStub {
  navigate(commands: any[]) {}
}

describe('AdministrarComponent', () => {
  let component: AdministrarComponent;
  let fixture: ComponentFixture<AdministrarComponent>;
  let httpMock: HttpTestingController;
  let router: Router;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [AdministrarComponent],
      imports: [ReactiveFormsModule, HttpClientTestingModule],
      providers: [
        { provide: Router, useClass: RouterStub }
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdministrarComponent);
    component = fixture.componentInstance;
    httpMock = TestBed.inject(HttpTestingController);
    router = TestBed.inject(Router);
    fixture.detectChanges();
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('form should be invalid when empty', () => {
    expect(component.createTeamForm.valid).toBeFalsy();
  });

  it('form should be valid when required fields are filled', () => {
    component.createTeamForm.controls['nombre_dt'].setValue('Juan');
    component.createTeamForm.controls['correo_dt'].setValue('juan@example.com');
    component.createTeamForm.controls['categoria'].setValue('Fútbol');
    expect(component.createTeamForm.valid).toBeTruthy();
  });

  it('toggleEditMode should switch editMode boolean', () => {
    expect(component.editMode).toBeFalsy();
    component.toggleEditMode();
    expect(component.editMode).toBeTruthy();
    component.toggleEditMode();
    expect(component.editMode).toBeFalsy();
  });

  it('cambiarColor should cycle colors correctly', () => {
    component.colorLocal = 'azul';
    component.cambiarColor('local', 1);
    expect(component.colorLocal).toBe('cafe');

    component.colorVisitante = 'rojo';
    component.cambiarColor('visitante', -1);
    expect(component.colorVisitante).toBe('negro');
  });

  it('seleccionarCategoria should set categoriaSeleccionada and update form', () => {
    spyOn(component, 'verificarEquipos');
    component.seleccionarCategoria('Tenis');
    expect(component.categoriaSeleccionada).toBe('Tenis');
    expect(component.createTeamForm.get('categoria')?.value).toBe('Tenis');
    expect(component.verificarEquipos).toHaveBeenCalled();
  });

  it('seleccionarColor should update colorLocal or colorVisitante and avoid duplicates', () => {
    component.colorVisitante = 'rojo';
    component.seleccionarColor('local', 'rojo');
    expect(component.colorLocal).toBe('rojo');
    expect(component.colorVisitante).toBe('');

    component.colorLocal = 'azul';
    component.seleccionarColor('visitante', 'azul');
    expect(component.colorVisitante).toBe('azul');
    expect(component.colorLocal).toBe('');
  });

  it('getCategoriaIconPath should return correct icon path', () => {
    const path = component.getCategoriaIconPath('Fútbol Americano');
    expect(path).toBe('assets/icons/fútbol_americano.png');
  });

  it('verificarEquipo should set equipoRegistrado true and navigate on success', () => {
    spyOn(router, 'navigate');
    const mockResponse = { success: true };

    component.verificarEquipo('Juan');
    const req = httpMock.expectOne(`${component.API_URL}/api/Ecategoria/equipo/Juan`);
    req.flush(mockResponse);

    expect(component.equipoRegistrado).toBeTrue();
    expect(router.navigate).toHaveBeenCalledWith(['/equipo']);
  });

  it('verificarEquipo should set equipoRegistrado false on failure', () => {
    const mockResponse = { success: false };

    component.verificarEquipo('Juan');
    const req = httpMock.expectOne(`${component.API_URL}/api/Ecategoria/equipo/Juan`);
    req.flush(mockResponse);

    expect(component.equipoRegistrado).toBeFalse();
  });

  it('verificarEquipo should set equipoRegistrado false on error', () => {
    component.verificarEquipo('Juan');
    const req = httpMock.expectOne(`${component.API_URL}/api/Ecategoria/equipo/Juan`);
    req.error(new ErrorEvent('Network error'));

    expect(component.equipoRegistrado).toBeFalse();
  });

  it('onSubmit should show error message if form invalid', () => {
    component.createTeamForm.controls['nombre_dt'].setValue('');
    component.onSubmit();
    expect(component.errorMessage).toBe('');
  });

  it('onSubmit should show error if usuario not in localStorage', () => {
    spyOn(localStorage, 'getItem').and.returnValue(null);
    component.createTeamForm.controls['nombre_dt'].setValue('Juan');
    component.createTeamForm.controls['correo_dt'].setValue('juan@example.com');
    component.createTeamForm.controls['categoria'].setValue('Fútbol');
    component.onSubmit();
    expect(component.errorMessage).toBe('No estás autenticado. Inicia sesión.');
  });

  // Puedes seguir agregando más pruebas para editarEquipo, pasos del formulario, etc.

});
