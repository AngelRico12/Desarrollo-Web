import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AdministrarComponent } from './administrar.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { FormBuilder } from '@angular/forms';

describe('AdministrarComponent - cobertura rápida', () => {
  let component: AdministrarComponent;
  let fixture: ComponentFixture<AdministrarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AdministrarComponent],
      imports: [HttpClientTestingModule, RouterTestingModule],
      providers: [FormBuilder]
    }).compileComponents();

    fixture = TestBed.createComponent(AdministrarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('debe crearse', () => {
    expect(component).toBeTruthy();
  });

  it('toggleEditMode debe cambiar editMode', () => {
    const original = component.editMode;
    component.toggleEditMode();
    expect(component.editMode).toBe(!original);
  });

  it('goToNextStep debe incrementar formStep', () => {
    component.formStep = 1;
    component.goToNextStep();
    expect(component.formStep).toBe(2);
  });

  it('goToPreviousStep debe decrementar formStep', () => {
    component.formStep = 2;
    component.goToPreviousStep();
    expect(component.formStep).toBe(1);
  });

  it('cambiarColor debe actualizar colorLocal y colorVisitante', () => {
    component.colorLocal = 'azul';
    component.colorVisitante = 'rojo';
    component.cambiarColor('local', 1);
    expect(component.colorLocal).not.toBe('azul');
    component.cambiarColor('visitante', 1);
    expect(component.colorVisitante).not.toBe('rojo');
  });

  it('seleccionarCategoria debe establecer categoriaSeleccionada y formulario', () => {
    spyOn(component, 'verificarEquipos');
    const categoria = 'Fútbol';
    component.seleccionarCategoria(categoria);
    expect(component.categoriaSeleccionada).toBe(categoria);
    expect(component.createTeamForm.get('categoria')?.value).toBe(categoria);
    expect(component.verificarEquipos).toHaveBeenCalled();
  });

  it('seleccionarColor debe cambiar colores y evitar colores iguales', () => {
    component.colorLocal = 'azul';
    component.colorVisitante = 'azul';

    component.seleccionarColor('local', 'rojo');
    expect(component.colorLocal).toBe('rojo');
    expect(component.colorVisitante).not.toBe('rojo');

    component.seleccionarColor('visitante', 'rojo');
    expect(component.colorVisitante).toBe('rojo');
    expect(component.colorLocal).not.toBe('rojo');
  });

  it('getCategoriaIconPath debe devolver ruta correcta', () => {
    const categoria = 'Fútbol Americano';
    const ruta = component.getCategoriaIconPath(categoria);
    expect(ruta).toBe('assets/icons/fútbol_americano.png');
  });
});
