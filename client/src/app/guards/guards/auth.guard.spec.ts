import { TestBed } from '@angular/core/testing';
import { CanActivateFn, Router } from '@angular/router';

import { AuthGuard} from './auth.guard';
import { AuthService } from 'src/app/Services/Auth/auth.service';

describe('AuthGuard', () => {
  let authService: AuthService;
  let router: Router;

  const executeGuard: CanActivateFn = (...guardParameters) =>
    TestBed.runInInjectionContext(() => new AuthGuard(authService, router).canActivate(...guardParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        AuthGuard,
        { provide: AuthService, useValue: jasmine.createSpyObj('AuthService', ['isAuthenticated']) },
        { provide: Router, useValue: jasmine.createSpyObj('Router', ['navigate']) }
      ]
    });
    authService = TestBed.inject(AuthService);
    router = TestBed.inject(Router);
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });
});
