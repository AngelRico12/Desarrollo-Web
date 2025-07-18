import { ComponentFixture, TestBed } from '@angular/core/testing';
import { GestionJugadoresComponent } from './gestion-jugadores.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormsModule } from '@angular/forms';
import { Component } from '@angular/core';

// 👇 Mock del componente <app-breadcrumb>
@Component({ selector: 'app-breadcrumb', template: '' })
class MockBreadcrumbComponent {}

describe('GestionJugadoresComponent', () => {
  let component: GestionJugadoresComponent;
  let fixture: ComponentFixture<GestionJugadoresComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [
        GestionJugadoresComponent,
        MockBreadcrumbComponent  // 👈 Incluimos el mock aquí
      ],
      imports: [
        HttpClientTestingModule,
        FormsModule
      ]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GestionJugadoresComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
