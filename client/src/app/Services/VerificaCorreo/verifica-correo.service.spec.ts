import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { VerificaCorreoService } from './verifica-correo.service';

describe('VerificaCorreoService', () => {
  let service: VerificaCorreoService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [VerificaCorreoService]
    });

    service = TestBed.inject(VerificaCorreoService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('debería hacer una solicitud GET para verificar el correo', () => {
    const correo = 'test@example.com';
    const mockResponse = { is_valid_format: { value: true }, email: correo };

    service.verificarCorreo(correo).subscribe(res => {
      expect(res).toEqual(mockResponse);
    });

    const req = httpMock.expectOne((req) =>
      req.url.includes('https://emailvalidation.abstractapi.com/v1/')
    );

    expect(req.request.method).toBe('GET');
    expect(req.request.urlWithParams).toContain(correo);

    req.flush(mockResponse);
  });
});
