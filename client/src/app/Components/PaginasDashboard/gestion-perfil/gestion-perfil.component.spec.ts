import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { GestionPerfilComponent } from './gestion-perfil.component';

// Mock del componente app-breadcrumb
@Component({
  selector: 'app-breadcrumb',
  template: ''
})
class MockBreadcrumbComponent {}

describe('GestionPerfilComponent', () => {
  let component: GestionPerfilComponent;
  let fixture: ComponentFixture<GestionPerfilComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [
        GestionPerfilComponent,
        MockBreadcrumbComponent
      ],
      imports: [
        FormsModule,               // Para [(ngModel)]
        HttpClientTestingModule    // Para HttpClient
      ]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GestionPerfilComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
