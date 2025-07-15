import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GestionJugadoresComponent } from './gestion-jugadores.component';

describe('GestionJugadoresComponent', () => {
  let component: GestionJugadoresComponent;
  let fixture: ComponentFixture<GestionJugadoresComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [GestionJugadoresComponent]
    });
    fixture = TestBed.createComponent(GestionJugadoresComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
