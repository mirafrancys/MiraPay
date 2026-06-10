import { describe, it, expect, beforeEach, vi } from 'vitest';
import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideRouter } from '@angular/router';
import { of } from 'rxjs';

import { ContratsComponent } from './contrats';
import { ContratsGateway } from '../../cores/gateways/contrats.gateway';
import { ClientsGateway } from '../../cores/gateways/clients.gateway';
import { TranslationService } from '../../cores/services/translation.service';

describe('ContratsComponent', () => {
  let mockContratsGateway: Partial<ContratsGateway>;
  let mockClientsGateway: Partial<ClientsGateway>;
  let mockTranslationService: Partial<TranslationService>;

  beforeEach(async () => {
    mockContratsGateway = {
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
      imports: [ContratsComponent],
      providers: [
        provideRouter([]),
        provideHttpClient(),
        { provide: ContratsGateway, useValue: mockContratsGateway },
        { provide: ClientsGateway, useValue: mockClientsGateway },
        { provide: TranslationService, useValue: mockTranslationService },
      ],
    }).compileComponents();
  });

  it('should create the component', () => {
    const fixture = TestBed.createComponent(ContratsComponent);
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('should init form correctly on openModal', () => {
    const fixture = TestBed.createComponent(ContratsComponent);
    const comp = fixture.componentInstance;
    
    fixture.detectChanges();
    
    comp.openModal();
    expect(comp.contratForm.get('numero')?.value).toContain('CTR-');
    expect(comp.contratForm.get('typeContrat')?.value).toBe('horaire');
    expect(comp.isModalOpen()).toBe(true);
  });

  it('should submit if form is valid', async () => {
    const fixture = TestBed.createComponent(ContratsComponent);
    const comp = fixture.componentInstance;
    
    fixture.detectChanges();
    comp.openModal();
    
    comp.contratForm.patchValue({
      clientId: 'c1',
      numero: 'CTR-123',
      dateDebut: '2024-01-01',
      typeContrat: 'forfait'
    });

    await comp.onSubmit();
    
    expect(mockContratsGateway.create).toHaveBeenCalled();
    expect(comp.isModalOpen()).toBe(false);
  });
});
