import { ComponentFixture, TestBed } from '@angular/core/testing';
import { GestionEquiposComponent } from './gestion-equipos.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormsModule } from '@angular/forms';
import { Component } from '@angular/core';

// 👇 Mock del componente <app-breadcrumb>
@Component({ selector: 'app-breadcrumb', template: '' })
class MockBreadcrumbComponent {}

describe('GestionEquiposComponent', () => {
  let component: GestionEquiposComponent;
  let fixture: ComponentFixture<GestionEquiposComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [
        GestionEquiposComponent,
        MockBreadcrumbComponent // 👈 Añadido aquí
      ],
      imports: [
        HttpClientTestingModule,
        FormsModule
      ]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GestionEquiposComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
