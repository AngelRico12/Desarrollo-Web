import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';  // <-- Importar módulo

import { EquipoDTService } from './equipo-dt.service';

describe('EquipoDTService', () => {
  let service: EquipoDTService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule]  // <-- Agregar aquí
    });
    service = TestBed.inject(EquipoDTService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
