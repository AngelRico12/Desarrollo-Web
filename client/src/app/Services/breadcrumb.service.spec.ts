import { TestBed } from '@angular/core/testing';
import { BreadcrumbService } from './breadcrumb.service';
import { ActivatedRoute, Router, NavigationEnd } from '@angular/router';
import { of, Subject } from 'rxjs';

describe('BreadcrumbService', () => {
  let service: BreadcrumbService;

  // Subject para simular eventos del Router
  const routerEventsSubject = new Subject<any>();

  const mockRouter = {
    events: routerEventsSubject.asObservable(),
    url: '/dashboard',
  };

  const mockActivatedRoute = {
    root: {
      children: [],
      snapshot: {
        url: [],
        data: {}
      }
    }
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        BreadcrumbService,
        { provide: Router, useValue: mockRouter },
        { provide: ActivatedRoute, useValue: mockActivatedRoute }
      ]
    });

    service = TestBed.inject(BreadcrumbService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should update breadcrumbs on NavigationEnd', () => {
    spyOn(service as any, 'updateBreadcrumbs').and.callThrough();

    // Emitir evento NavigationEnd para disparar updateBreadcrumbs
    routerEventsSubject.next(new NavigationEnd(1, '/dashboard', '/dashboard'));

    expect((service as any).updateBreadcrumbs).toHaveBeenCalled();
  });
});
