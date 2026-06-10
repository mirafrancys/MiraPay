import { describe, it, expect, beforeEach, vi } from 'vitest';
import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideRouter } from '@angular/router';
import { of } from 'rxjs';

import { ClientsComponent } from './clients';
import { ClientsGateway } from '../../cores/gateways/clients.gateway';
import { TranslationService } from '../../cores/services/translation.service';
import { IClient } from '@mirapay/shared-models';

const mockClients: IClient[] = [
  {
    id: '1',
    typeClient: 'entreprise',
    nomLegal: 'Acme Corp',
    adresseLigne1: '123 Main St',
    ville: 'Montreal',
    province: 'QC',
    codePostal: 'H1A 1A1',
    pays: 'Canada',
    courriel: 'contact@acme.com',
    telephone: '514-555-0000',
    modeFacturationParDefaut: 'horaire',
    deviseParDefaut: 'CAD',
    clientTaxable: true,
    appliquerTPS: true,
    appliquerTVQ: true,
    estArchive: false,
    createdAt: new Date(),
    updatedAt: new Date(),
  }
];

describe('ClientsComponent', () => {
  let mockClientsGateway: Partial<ClientsGateway>;
  let mockTranslationService: Partial<TranslationService>;

  beforeEach(async () => {
    mockClientsGateway = {
      getAll: vi.fn().mockReturnValue(of(mockClients)),
      create: vi.fn().mockReturnValue(of(mockClients[0])),
    };

    mockTranslationService = {
      translate: vi.fn((key: string) => key),
      getLanguage: vi.fn().mockReturnValue('fr'),
      setLanguage: vi.fn(),
    };

    await TestBed.configureTestingModule({
      imports: [ClientsComponent],
      providers: [
        provideRouter([]),
        provideHttpClient(),
        { provide: ClientsGateway, useValue: mockClientsGateway },
        { provide: TranslationService, useValue: mockTranslationService },
      ],
    }).compileComponents();
  });

  it('should create the component', () => {
    const fixture = TestBed.createComponent(ClientsComponent);
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('should load clients on init', async () => {
    const fixture = TestBed.createComponent(ClientsComponent);
    const comp = fixture.componentInstance;
    
    // Call ngOnInit manually or detect changes
    fixture.detectChanges();
    await fixture.whenStable();

    expect(mockClientsGateway.getAll).toHaveBeenCalled();
    expect(comp.clients().length).toBe(1);
    expect(comp.clients()[0].nomLegal).toBe('Acme Corp');
  });

  it('should handle modal state correctly', () => {
    const fixture = TestBed.createComponent(ClientsComponent);
    const comp = fixture.componentInstance;
    
    fixture.detectChanges();

    expect(comp.isModalOpen()).toBe(false);
    
    comp.openModal();
    expect(comp.isModalOpen()).toBe(true);
    expect(comp.clientForm.get('typeClient')?.value).toBe('entreprise');

    comp.closeModal();
    expect(comp.isModalOpen()).toBe(false);
  });

  it('should invalidate form if required fields are missing', () => {
    const fixture = TestBed.createComponent(ClientsComponent);
    const comp = fixture.componentInstance;
    
    fixture.detectChanges();
    comp.openModal(); // Reset form with defaults

    // nomLegal is missing
    expect(comp.clientForm.valid).toBe(false);

    comp.clientForm.patchValue({
      nomLegal: 'Test Client',
      adresseLigne1: '123 Test',
      ville: 'Test City',
      province: 'Test Prov',
      codePostal: 'A1A 1A1',
      courriel: 'invalidemail', // Invalid email
      telephone: '1234567890'
    });

    expect(comp.clientForm.valid).toBe(false); // Because email is invalid
    
    comp.clientForm.patchValue({ courriel: 'test@example.com' });
    expect(comp.clientForm.valid).toBe(true);
  });

  it('should submit form if valid', async () => {
    const fixture = TestBed.createComponent(ClientsComponent);
    const comp = fixture.componentInstance;
    
    fixture.detectChanges();
    comp.openModal();
    
    comp.clientForm.patchValue({
      nomLegal: 'New Client',
      adresseLigne1: '123 Test',
      ville: 'Test City',
      province: 'Test Prov',
      codePostal: 'A1A 1A1',
      courriel: 'test@example.com',
      telephone: '1234567890'
    });

    await comp.onSubmit();

    expect(mockClientsGateway.create).toHaveBeenCalled();
    expect(comp.isModalOpen()).toBe(false);
    expect(mockClientsGateway.getAll).toHaveBeenCalledTimes(2); // Once on init, once after submit
  });

  it('should not submit form if invalid', async () => {
    const fixture = TestBed.createComponent(ClientsComponent);
    const comp = fixture.componentInstance;
    
    fixture.detectChanges();
    comp.openModal();
    
    // Form is currently invalid
    await comp.onSubmit();

    expect(mockClientsGateway.create).not.toHaveBeenCalled();
  });
});
