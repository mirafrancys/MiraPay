import { describe, it, expect, beforeEach, vi } from 'vitest';
import { TestBed } from '@angular/core/testing';
import { provideRouter, Router } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { of, throwError } from 'rxjs';

import { LoginComponent } from './login';
import { AuthGateway } from '../../cores/gateways/auth.gateway';
import { TranslationService } from '../../cores/services/translation.service';
import { IUser } from '@mirapay/shared-models';

const mockUser: IUser = {
  id: '1',
  username: 'jdoe',
  email: 'jdoe@example.com',
  firstName: 'John',
  lastName: 'Doe',
  isActive: true,
  createdAt: new Date(),
  updatedAt: new Date(),
};

describe('LoginComponent', () => {
  let mockAuthGateway: Partial<AuthGateway>;
  let mockTranslationService: Partial<TranslationService>;

  beforeEach(async () => {
    mockAuthGateway = {
      login: vi.fn().mockReturnValue(of({ user: mockUser })),
      logout: vi.fn(),
      checkAuth: vi.fn().mockReturnValue(false),
    };

    mockTranslationService = {
      translate: vi.fn((key: string) => key),
      getLanguage: vi.fn().mockReturnValue('fr'),
      setLanguage: vi.fn(),
    };

    await TestBed.configureTestingModule({
      imports: [LoginComponent],
      providers: [
        provideRouter([]),
        provideHttpClient(),
        { provide: AuthGateway, useValue: mockAuthGateway },
        { provide: TranslationService, useValue: mockTranslationService },
      ],
    }).compileComponents();
  });

  it('should create the component', () => {
    const fixture = TestBed.createComponent(LoginComponent);
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('should have initial state: isLoading=false and no errorMessage', () => {
    const fixture = TestBed.createComponent(LoginComponent);
    const comp = fixture.componentInstance;
    expect(comp.isLoading).toBe(false);
    expect(comp.errorMessage).toBe('');
  });

  it('should have empty credentials by default', () => {
    const fixture = TestBed.createComponent(LoginComponent);
    const comp = fixture.componentInstance;
    expect(comp.credentials.emailOrUsername).toBe('');
    expect(comp.credentials.password).toBe('');
  });

  it('should call authGateway.login and navigate on success', async () => {
    const fixture = TestBed.createComponent(LoginComponent);
    const comp = fixture.componentInstance;
    const router = TestBed.inject(Router);
    const navigateSpy = vi.spyOn(router, 'navigate').mockResolvedValue(true);

    comp.credentials = { emailOrUsername: 'jdoe', password: 'secret' };
    await comp.onSubmit();

    expect(mockAuthGateway.login).toHaveBeenCalledWith({ emailOrUsername: 'jdoe', password: 'secret' });
    expect(navigateSpy).toHaveBeenCalledWith(['/dashboard']);
    expect(comp.isLoading).toBe(false);
  });

  it('should set errorMessage on login failure with Error instance', async () => {
    (mockAuthGateway.login as ReturnType<typeof vi.fn>).mockReturnValue(
      throwError(() => new Error('Identifiants invalides'))
    );

    const fixture = TestBed.createComponent(LoginComponent);
    const comp = fixture.componentInstance;

    await comp.onSubmit();

    expect(comp.errorMessage).toBe('Identifiants invalides');
    expect(comp.isLoading).toBe(false);
  });

  it('should set generic errorMessage on non-Error failure', async () => {
    (mockAuthGateway.login as ReturnType<typeof vi.fn>).mockReturnValue(
      throwError(() => 'unknown error')
    );

    const fixture = TestBed.createComponent(LoginComponent);
    const comp = fixture.componentInstance;

    await comp.onSubmit();

    expect(comp.errorMessage).toBe('An error occurred');
    expect(comp.isLoading).toBe(false);
  });
});
