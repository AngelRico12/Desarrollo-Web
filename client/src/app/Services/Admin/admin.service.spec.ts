import { TestBed } from '@angular/core/testing';
import { AdminService } from './admin.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('AdminService', () => {
  let service: AdminService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [AdminService]
    });
    service = TestBed.inject(AdminService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
