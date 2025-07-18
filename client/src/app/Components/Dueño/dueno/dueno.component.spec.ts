import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DuenoComponent } from './dueno.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { AdminService } from '../../../Services/Admin/admin.service';

describe('DuenoComponent', () => {
  let component: DuenoComponent;
  let fixture: ComponentFixture<DuenoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DuenoComponent],
      imports: [HttpClientTestingModule], // <-- IMPORTANTE
      providers: [AdminService]
    }).compileComponents();

    fixture = TestBed.createComponent(DuenoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
