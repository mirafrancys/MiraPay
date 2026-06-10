import { describe, it, expect, beforeEach, vi } from 'vitest';
import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideRouter } from '@angular/router';
import { of } from 'rxjs';

import { SoumissionsComponent } from './soumissions';
import { SoumissionsGateway } from '../../cores/gateways/soumissions.gateway';
import { ClientsGateway } from '../../cores/gateways/clients.gateway';
import { TranslationService } from '../../cores/services/translation.service';

describe('SoumissionsComponent', () => {
  let mockSoumissionsGateway: Partial<SoumissionsGateway>;
  let mockClientsGateway: Partial<ClientsGateway>;
  let mockTranslationService: Partial<TranslationService>;

  beforeEach(async () => {
    mockSoumissionsGateway = {
      getAll: vi.fn().mockReturnValue(of([])),
      create: vi.fn().mockReturnValue(of({})),
    };

    mockClientsGateway = {
      getAll: vi.fn().mockReturnValue(of([])),
    };

    mockTranslationService = {
      translate: vi.fn((key: string) => key),
      getLanguage: vi.fn().mockReturnValue('fr'),
      setLanguage: vi.fn(),
    };

    await TestBed.configureTestingModule({
      imports: [SoumissionsComponent],
      providers: [
        provideRouter([]),
        provideHttpClient(),
        { provide: SoumissionsGateway, useValue: mockSoumissionsGateway },
        { provide: ClientsGateway, useValue: mockClientsGateway },
        { provide: TranslationService, useValue: mockTranslationService },
      ],
    }).compileComponents();
  });

  it('should create the component', () => {
    const fixture = TestBed.createComponent(SoumissionsComponent);
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('should have one default line on init', () => {
    const fixture = TestBed.createComponent(SoumissionsComponent);
    const comp = fixture.componentInstance;
    
    fixture.detectChanges();
    
    expect(comp.lines.length).toBe(1);
  });

  it('should add and remove lines', () => {
    const fixture = TestBed.createComponent(SoumissionsComponent);
    const comp = fixture.componentInstance;
    
    fixture.detectChanges();
    
    expect(comp.lines.length).toBe(1);
    
    comp.addLine();
    expect(comp.lines.length).toBe(2);
    
    comp.removeLine(0);
    expect(comp.lines.length).toBe(1);
  });

  it('should automatically calculate montantLigne when quantite or prixUnitaire changes', () => {
    const fixture = TestBed.createComponent(SoumissionsComponent);
    const comp = fixture.componentInstance;
    
    fixture.detectChanges();
    
    const firstLineGroup = comp.lines.at(0);
    firstLineGroup.patchValue({ quantite: 2, prixUnitaire: 50 });
    
    expect(firstLineGroup.get('montantLigne')?.value).toBe(100);
  });

  it('should calculate taxes and totals on submit', async () => {
    const fixture = TestBed.createComponent(SoumissionsComponent);
    const comp = fixture.componentInstance;
    
    fixture.detectChanges();
    comp.openModal();
    
    comp.soumissionForm.patchValue({
      clientId: 'c1',
      titre: 'Test Soumission',
      numero: 'S-123'
    });
    
    const firstLineGroup = comp.lines.at(0);
    firstLineGroup.patchValue({ description: 'Dev', quantite: 10, prixUnitaire: 100, typeLigne: 'service' });

    await comp.onSubmit();
    
    expect(mockSoumissionsGateway.create).toHaveBeenCalled();
    const payload = (mockSoumissionsGateway.create as ReturnType<typeof vi.fn>).mock.calls[0][0];
    
    expect(payload.sousTotalHT).toBe(1000); // 10 * 100
    expect(payload.montantTPS).toBe(50); // 1000 * 0.05
    expect(payload.montantTVQ).toBe(99.75); // 1000 * 0.09975
    expect(payload.totalTTC).toBe(1149.75); // 1000 + 50 + 99.75
  });
});
