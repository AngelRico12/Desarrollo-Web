import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MapaSitioComponent } from './mapa-sitio.component';

describe('MapaSitioComponent', () => {
  let component: MapaSitioComponent;
  let fixture: ComponentFixture<MapaSitioComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [MapaSitioComponent]
    });
    fixture = TestBed.createComponent(MapaSitioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
