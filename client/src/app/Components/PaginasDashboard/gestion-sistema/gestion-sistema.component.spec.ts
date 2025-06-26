import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GestionSistemaComponent } from './gestion-sistema.component';

describe('GestionSistemaComponent', () => {
  let component: GestionSistemaComponent;
  let fixture: ComponentFixture<GestionSistemaComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [GestionSistemaComponent]
    });
    fixture = TestBed.createComponent(GestionSistemaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
