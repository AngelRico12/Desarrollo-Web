import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GestionEquiposComponent } from './gestion-equipos.component';

describe('GestionEquiposComponent', () => {
  let component: GestionEquiposComponent;
  let fixture: ComponentFixture<GestionEquiposComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [GestionEquiposComponent]
    });
    fixture = TestBed.createComponent(GestionEquiposComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
