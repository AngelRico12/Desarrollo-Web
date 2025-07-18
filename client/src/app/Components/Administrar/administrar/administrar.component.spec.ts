import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';  // Importa el módulo para HTTP en tests

import { AdministrarComponent } from './administrar.component';

describe('AdministrarComponent', () => {
  let component: AdministrarComponent;
  let fixture: ComponentFixture<AdministrarComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AdministrarComponent],
      imports: [HttpClientTestingModule]  // Agrega aquí
    });
    fixture = TestBed.createComponent(AdministrarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
