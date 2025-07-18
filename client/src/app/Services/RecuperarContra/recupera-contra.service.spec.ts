import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { RecuperaContraService } from './recupera-contra.service';

describe('RecuperaContraService', () => {
  let service: RecuperaContraService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [RecuperaContraService]
    });
    service = TestBed.inject(RecuperaContraService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify(); // Asegura que no queden peticiones pendientes
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('debería enviar el código al correo', (done) => {
    const correo = 'test@example.com';
    const mockResponse = { mensaje: 'Código enviado' };

    service.enviarCodigo(correo).subscribe(res => {
      expect(res).toEqual(mockResponse);
      done(); // Aquí indicamos que el test terminó correctamente
    });

    const req = httpMock.expectOne(`${service['apiUrl']}/api/recupera/enviar`);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual({ correo });
    req.flush(mockResponse);
  });

  it('debería restablecer la contraseña', (done) => {
    const correo = 'test@example.com';
    const contrasena = '123456';
    const mockResponse = { mensaje: 'Contraseña actualizada' };

    service.restablecerContrasena(correo, contrasena).subscribe(res => {
      expect(res).toEqual(mockResponse);
      done(); // Aquí indicamos que el test terminó correctamente
    });

    const req = httpMock.expectOne(`${service['apiUrl']}/api/recupera/cambiar`);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual({ correo, contrasena });
    req.flush(mockResponse);
  });
});
