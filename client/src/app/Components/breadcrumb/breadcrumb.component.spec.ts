import { TestBed } from '@angular/core/testing';
import { BreadcrumbService } from '../../Services/breadcrumb.service';
import { ActivatedRoute } from '@angular/router';

describe('BreadcrumbService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        BreadcrumbService,
        { provide: ActivatedRoute, useValue: {} } // <- aquí simulas el ActivatedRoute
      ]
    });
  });

  it('should be created', () => {
    const service = TestBed.inject(BreadcrumbService);
    expect(service).toBeTruthy();
  });
});
