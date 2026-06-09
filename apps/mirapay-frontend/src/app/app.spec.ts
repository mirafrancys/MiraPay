import { describe, it, expect, beforeEach } from 'vitest';
import { TestBed } from '@angular/core/testing';
import { App } from './app';
import { AuthGateway } from './cores/gateways/auth.gateway';
import { signal } from '@angular/core';
import { provideRouter } from '@angular/router';

describe('App', () => {
  let mockAuthGateway: any;

  beforeEach(async () => {
    mockAuthGateway = {
      currentUser: signal(null),
      checkAuth: () => false,
      logout: () => {},
    };

    await TestBed.configureTestingModule({
      imports: [App],
      providers: [
        { provide: AuthGateway, useValue: mockAuthGateway },
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
