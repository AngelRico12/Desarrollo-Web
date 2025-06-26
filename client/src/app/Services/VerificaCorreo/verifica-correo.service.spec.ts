import { TestBed } from '@angular/core/testing';

import { VerificaCorreoService } from './verifica-correo.service';

describe('VerificaCorreoService', () => {
  let service: VerificaCorreoService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(VerificaCorreoService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
