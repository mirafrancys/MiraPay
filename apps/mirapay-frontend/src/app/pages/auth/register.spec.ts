import { describe, it, expect, beforeEach, vi } from 'vitest';
import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { of, throwError } from 'rxjs';

import { RegisterComponent } from './register';
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

describe('RegisterComponent', () => {
  let mockAuthGateway: Partial<AuthGateway>;
  let mockTranslationService: Partial<TranslationService>;

  beforeEach(async () => {
    mockAuthGateway = {
      register: vi.fn().mockReturnValue(of(mockUser)),
      logout: vi.fn(),
      checkAuth: vi.fn().mockReturnValue(false),
    };

    mockTranslationService = {
      translate: vi.fn((key: string) => key),
      getLanguage: vi.fn().mockReturnValue('fr'),
      setLanguage: vi.fn(),
    };

    await TestBed.configureTestingModule({
      imports: [RegisterComponent],
      providers: [
        provideRouter([]),
        provideHttpClient(),
        { provide: AuthGateway, useValue: mockAuthGateway },
        { provide: TranslationService, useValue: mockTranslationService },
      ],
    }).compileComponents();
  });

  it('should create the component', () => {
    const fixture = TestBed.createComponent(RegisterComponent);
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('should have initial state: isLoading=false, no error or success messages', () => {
    const fixture = TestBed.createComponent(RegisterComponent);
    const comp = fixture.componentInstance;
    expect(comp.isLoading).toBe(false);
    expect(comp.errorMessage).toBe('');
    expect(comp.successMessage).toBe('');
  });

  it('should initialize user with empty strings', () => {
    const fixture = TestBed.createComponent(RegisterComponent);
    const comp = fixture.componentInstance;
    expect(comp.user.firstName).toBe('');
    expect(comp.user.email).toBe('');
    expect(comp.user.username).toBe('');
  });

  it('should set successMessage on successful registration', async () => {
    const fixture = TestBed.createComponent(RegisterComponent);
    const comp = fixture.componentInstance;

    await comp.onSubmit();

    expect(mockAuthGateway.register).toHaveBeenCalled();
    expect(comp.successMessage).toContain('succès');
    expect(comp.errorMessage).toBe('');
    expect(comp.isLoading).toBe(false);
  });

  it('should set errorMessage on registration failure with Error instance', async () => {
    (mockAuthGateway.register as ReturnType<typeof vi.fn>).mockReturnValue(
      throwError(() => new Error('Courriel déjà utilisé'))
    );

    const fixture = TestBed.createComponent(RegisterComponent);
    const comp = fixture.componentInstance;

    await comp.onSubmit();

    expect(comp.errorMessage).toBe('Courriel déjà utilisé');
    expect(comp.successMessage).toBe('');
    expect(comp.isLoading).toBe(false);
  });

  it('should set generic errorMessage on non-Error failure', async () => {
    (mockAuthGateway.register as ReturnType<typeof vi.fn>).mockReturnValue(
      throwError(() => 'network error')
    );

    const fixture = TestBed.createComponent(RegisterComponent);
    const comp = fixture.componentInstance;

    await comp.onSubmit();

    expect(comp.errorMessage).toBe('An error occurred');
  });
});
