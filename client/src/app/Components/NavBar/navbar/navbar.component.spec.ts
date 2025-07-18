import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NavbarComponent } from './navbar.component';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { AuthService } from 'src/app/Services/Auth/auth.service';

describe('NavbarComponent', () => {
  let component: NavbarComponent;
  let fixture: ComponentFixture<NavbarComponent>;

  // Opcional: mock simple para AuthService
  const mockAuthService = {
    estaAutenticado: () => true,
    obtenerUsuario: () => ({ rol: 'admin', nombre: 'Usuario Test' }),
    logout: () => {}
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [NavbarComponent],
      imports: [
        RouterTestingModule,
        HttpClientTestingModule  // << Aquí se provee HttpClient
      ],
      providers: [
        { provide: AuthService, useValue: mockAuthService } // usa mock opcional
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(NavbarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
