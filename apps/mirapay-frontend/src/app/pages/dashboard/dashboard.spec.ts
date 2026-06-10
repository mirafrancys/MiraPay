import { describe, it, expect, beforeEach, vi } from 'vitest';
import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';

import { DashboardComponent } from './dashboard';
import { TranslationService } from '../../cores/services/translation.service';

describe('DashboardComponent', () => {
  let mockTranslationService: Partial<TranslationService>;

  beforeEach(async () => {
    mockTranslationService = {
      translate: vi.fn((key: string) => key),
      getLanguage: vi.fn().mockReturnValue('fr'),
      setLanguage: vi.fn(),
    };

    await TestBed.configureTestingModule({
      imports: [DashboardComponent],
      providers: [
        provideHttpClient(),
        { provide: TranslationService, useValue: mockTranslationService },
      ],
    }).compileComponents();
  });

  it('should create the component', () => {
    const fixture = TestBed.createComponent(DashboardComponent);
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('should have 4 static transactions', () => {
    const fixture = TestBed.createComponent(DashboardComponent);
    const comp = fixture.componentInstance;
    expect(comp.transactions.length).toBe(4);
  });

  it('should have transactions with id, user, amount, status and date properties', () => {
    const fixture = TestBed.createComponent(DashboardComponent);
    const comp = fixture.componentInstance;
    const t = comp.transactions[0];
    expect(t).toHaveProperty('id');
    expect(t).toHaveProperty('user');
    expect(t).toHaveProperty('amount');
    expect(t).toHaveProperty('status');
    expect(t).toHaveProperty('date');
  });

  it('should have transactions with positive and negative amounts', () => {
    const fixture = TestBed.createComponent(DashboardComponent);
    const comp = fixture.componentInstance;
    const amounts = comp.transactions.map(t => t.amount);
    expect(amounts.some(a => a < 0)).toBe(true);
    expect(amounts.some(a => a > 0)).toBe(true);
  });
});
