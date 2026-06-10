import { describe, it, expect, beforeEach, vi } from 'vitest';
import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideRouter } from '@angular/router';
import { of } from 'rxjs';

import { InvoicesComponent } from './invoices';
import { InvoicesGateway } from '../../cores/gateways/invoices.gateway';
import { ClientsGateway } from '../../cores/gateways/clients.gateway';
import { ProjectsGateway } from '../../cores/gateways/projects.gateway';
import { TranslationService } from '../../cores/services/translation.service';

describe('InvoicesComponent', () => {
  let mockInvoicesGateway: Partial<InvoicesGateway>;
  let mockClientsGateway: Partial<ClientsGateway>;
  let mockProjectsGateway: Partial<ProjectsGateway>;
  let mockTranslationService: Partial<TranslationService>;

  beforeEach(async () => {
    mockInvoicesGateway = {
      getAll: vi.fn().mockReturnValue(of([])),
      create: vi.fn().mockReturnValue(of({})),
      prepareDraft: vi.fn().mockReturnValue(of({ sousTotal: 100, montantTPS: 5, montantTVQ: 10, totalTTC: 115 })),
    };

    mockClientsGateway = {
      getAll: vi.fn().mockReturnValue(of([{ id: 'c1', nomLegal: 'Client 1' }])),
    };

    mockProjectsGateway = {
      getAll: vi.fn().mockReturnValue(of([
        { id: 'p1', clientId: 'c1', nom: 'Project 1' },
        { id: 'p2', clientId: 'c2', nom: 'Project 2' }
      ])),
    };

    mockTranslationService = {
      translate: vi.fn((key: string) => key),
      getLanguage: vi.fn().mockReturnValue('fr'),
      setLanguage: vi.fn(),
    };

    await TestBed.configureTestingModule({
      imports: [InvoicesComponent],
      providers: [
        provideRouter([]),
        provideHttpClient(),
        { provide: InvoicesGateway, useValue: mockInvoicesGateway },
        { provide: ClientsGateway, useValue: mockClientsGateway },
        { provide: ProjectsGateway, useValue: mockProjectsGateway },
        { provide: TranslationService, useValue: mockTranslationService },
      ],
    }).compileComponents();
  });

  it('should create the component', () => {
    const fixture = TestBed.createComponent(InvoicesComponent);
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('should filter projects correctly based on selected client', async () => {
    const fixture = TestBed.createComponent(InvoicesComponent);
    const comp = fixture.componentInstance;
    
    fixture.detectChanges();
    await comp.loadData(); // wait explicitly for data loading

    comp.invoiceForm.patchValue({ clientId: 'c1' });
    expect(comp.filteredProjects().length).toBe(1);
    expect(comp.filteredProjects()[0].id).toBe('p1');

    comp.invoiceForm.patchValue({ clientId: 'c2' });
    expect(comp.filteredProjects().length).toBe(1);
    expect(comp.filteredProjects()[0].id).toBe('p2');

    comp.invoiceForm.patchValue({ clientId: 'nonexistent' });
    expect(comp.filteredProjects().length).toBe(0);
  });

  it('should reset projetId and draft on client change', () => {
    const fixture = TestBed.createComponent(InvoicesComponent);
    const comp = fixture.componentInstance;
    
    fixture.detectChanges();
    
    comp.invoiceForm.patchValue({ projetId: 'p1' });
    comp.draftData.set({ id: 'draft' } as unknown as import('@mirapay/shared-models').IInvoice);
    
    comp.onClientChange();
    
    expect(comp.invoiceForm.get('projetId')?.value).toBe('');
    expect(comp.draftData()).toBeNull();
  });

  it('should prepare draft correctly', async () => {
    const fixture = TestBed.createComponent(InvoicesComponent);
    const comp = fixture.componentInstance;
    
    fixture.detectChanges();
    comp.invoiceForm.patchValue({ clientId: 'c1' });
    
    await comp.prepareDraft();
    
    expect(mockInvoicesGateway.prepareDraft).toHaveBeenCalledWith({ clientId: 'c1' });
    expect(comp.draftData()).toBeTruthy();
    expect(comp.draftData()?.totalTTC).toBe(115);
  });
});
