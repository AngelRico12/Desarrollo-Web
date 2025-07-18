import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RegistrarClubComponent } from './registrar-club.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRoute } from '@angular/router';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms'; // Para ngForm y ngModel

// Mock del componente breadcrumb
@Component({ selector: 'app-breadcrumb', template: '' })
class MockBreadcrumbComponent {}

describe('RegistrarClubComponent', () => {
  let component: RegistrarClubComponent;
  let fixture: ComponentFixture<RegistrarClubComponent>;

  // Mock del Tooltip para espiar si fue llamado
  class MockTooltip {
    constructor(el: any) {
      MockTooltip.instances.push(el);
    }
    static instances: any[] = [];
  }

  beforeEach(async () => {
    // Mock global bootstrap con Tooltip mockeado
    (window as any).bootstrap = {
      Tooltip: MockTooltip
    };

    await TestBed.configureTestingModule({
      declarations: [
        RegistrarClubComponent,
        MockBreadcrumbComponent
      ],
      imports: [
        HttpClientTestingModule,
        FormsModule
      ],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: { snapshot: { data: {}, paramMap: {} } }
        }
      ]
    }).compileComponents();

    // Resetear instancias antes de crear componente
    MockTooltip.instances = [];

    fixture = TestBed.createComponent(RegistrarClubComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize bootstrap tooltips on elements', () => {
    // Llama explícitamente a ngAfterViewInit para probar tooltip init
    component.ngAfterViewInit();

    // Esperamos que al menos un tooltip se haya creado
    expect(MockTooltip.instances.length).toBeGreaterThan(0);

    // Opcional: inspecciona algún elemento tooltip creado
    // expect(MockTooltip.instances[0]).toBeDefined();
  });
});
