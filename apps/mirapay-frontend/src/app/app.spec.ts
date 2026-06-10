import { describe, it, expect, beforeEach } from 'vitest';
import { TestBed } from '@angular/core/testing';
import { App } from './app';
import { AuthGateway } from './cores/gateways/auth.gateway';
import { signal } from '@angular/core';
import { provideRouter } from '@angular/router';
import { TranslationService } from './cores/services/translation.service';
import { vi } from 'vitest';

describe('App', () => {
  let mockAuthGateway: Partial<AuthGateway>;
  let mockTranslationService: Partial<TranslationService>;

  beforeEach(async () => {
    mockAuthGateway = {
      currentUser: signal(null),
      checkAuth: () => false,
      logout: () => {
        // Mock method (noop)
      },
    };

    mockTranslationService = {
      translate: vi.fn((key: string) => key),
      getLanguage: vi.fn().mockReturnValue('fr'),
      setLanguage: vi.fn(),
    };

    await TestBed.configureTestingModule({
      imports: [App],
      providers: [
        { provide: AuthGateway, useValue: mockAuthGateway },
        { provide: TranslationService, useValue: mockTranslationService },
        provideRouter([]),
      ],
    }).compileComponents();
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(App);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });
});
