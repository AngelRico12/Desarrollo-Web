import { ComponentFixture, TestBed } from '@angular/core/testing';
import { EditarPerfilComponent } from './editar-perfil.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { AuthService } from '../../Services/Auth/auth.service';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms'; // 👈 AÑADIDO

// 👇 Mock para app-breadcrumb
@Component({ selector: 'app-breadcrumb', template: '' })
class MockBreadcrumbComponent {}

describe('EditarPerfilComponent', () => {
  let component: EditarPerfilComponent;
  let fixture: ComponentFixture<EditarPerfilComponent>;

  const authServiceMock = {
    obtenerUsuario: () => ({ id_club: 123 })
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [
        EditarPerfilComponent,
        MockBreadcrumbComponent
      ],
      imports: [
        HttpClientTestingModule,
        FormsModule // 👈 IMPORTANTE
      ],
      providers: [
        { provide: AuthService, useValue: authServiceMock }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(EditarPerfilComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
