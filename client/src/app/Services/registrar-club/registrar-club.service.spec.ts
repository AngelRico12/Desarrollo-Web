import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { ClubService } from './registrar-club.service';

describe('ClubService', () => {
  let service: ClubService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [ClubService],
    });

    service = TestBed.inject(ClubService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify(); // Verifica que no queden peticiones pendientes
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should register a club successfully', () => {
    const mockClub = {
      id_club: 1,
      nombre: 'Club Ejemplo',
      correo: 'club@example.com',
      certificado: 'cert.pdf',
      logotipo: 'logo.png',
      estado: 'activo',
    };

    const mockResponse = {
      success: true,
      club: mockClub,
    };

    const nombre = 'Club Ejemplo';
    const correo = 'club@example.com';
    const certificado = new File(['dummy content'], 'cert.pdf', { type: 'application/pdf' });
    const logotipo = new File(['dummy logo'], 'logo.png', { type: 'image/png' });

    service.registerClub(nombre, correo, certificado, logotipo).subscribe((res) => {
      expect(res.success).toBeTrue();
      expect(res.club).toEqual(mockClub);
    });

    const req = httpMock.expectOne(`${service['apiUrl']}`);
    expect(req.request.method).toBe('POST');
    expect(req.request.body instanceof FormData).toBeTrue();

    const formData = req.request.body as FormData;
    expect(formData.has('nombre')).toBeTrue();
    expect(formData.has('correo')).toBeTrue();
    expect(formData.has('certificado')).toBeTrue();
    expect(formData.has('logotipo')).toBeTrue();

    req.flush(mockResponse);
  });

  it('should handle registration error', () => {
    const certificado = new File(['dummy content'], 'cert.pdf', { type: 'application/pdf' });
    const logotipo = new File(['dummy logo'], 'logo.png', { type: 'image/png' });

    service.registerClub('Test Club', 'test@example.com', certificado, logotipo).subscribe({
      next: () => fail('Expected error'),
      error: (err) => {
        expect(err).toBeTruthy();
        expect(err.message).toBe('Error al registrar el club.');
      },
    });

    const req = httpMock.expectOne(`${service['apiUrl']}`);
    req.error(new ProgressEvent('error'), { status: 500, statusText: 'Internal Server Error' });
  });
});
