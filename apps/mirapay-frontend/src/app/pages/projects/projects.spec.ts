import { describe, it, expect, beforeEach, vi } from 'vitest';
import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideRouter } from '@angular/router';
import { of } from 'rxjs';

import { ProjectsComponent } from './projects';
import { ProjectsGateway } from '../../cores/gateways/projects.gateway';
import { ClientsGateway } from '../../cores/gateways/clients.gateway';
import { TranslationService } from '../../cores/services/translation.service';


describe('ProjectsComponent', () => {
  let mockProjectsGateway: Partial<ProjectsGateway>;
  let mockClientsGateway: Partial<ClientsGateway>;
  let mockTranslationService: Partial<TranslationService>;

  beforeEach(async () => {
    mockProjectsGateway = {
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
      imports: [ProjectsComponent],
      providers: [
        provideRouter([]),
        provideHttpClient(),
        { provide: ProjectsGateway, useValue: mockProjectsGateway },
        { provide: ClientsGateway, useValue: mockClientsGateway },
        { provide: TranslationService, useValue: mockTranslationService },
      ],
    }).compileComponents();
  });

  it('should create the component', () => {
    const fixture = TestBed.createComponent(ProjectsComponent);
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('should load data on init', async () => {
    const fixture = TestBed.createComponent(ProjectsComponent);
    //const comp = fixture.componentInstance;
    
    fixture.detectChanges();
    await fixture.whenStable();

    expect(mockProjectsGateway.getAll).toHaveBeenCalled();
    expect(mockClientsGateway.getAll).toHaveBeenCalled();
  });

  it('should open and close modal', () => {
    const fixture = TestBed.createComponent(ProjectsComponent);
    const comp = fixture.componentInstance;
    
    fixture.detectChanges();
    
    comp.openModal();
    expect(comp.isModalOpen()).toBe(true);
    expect(comp.projectForm.get('statut')?.value).toBe('enCours');

    comp.closeModal();
    expect(comp.isModalOpen()).toBe(false);
  });

  it('should not submit if form is invalid', async () => {
    const fixture = TestBed.createComponent(ProjectsComponent);
    const comp = fixture.componentInstance;
    
    fixture.detectChanges();
    comp.openModal();
    
    await comp.onSubmit();
    expect(mockProjectsGateway.create).not.toHaveBeenCalled();
  });

  it('should submit if form is valid and format payload correctly', async () => {
    const fixture = TestBed.createComponent(ProjectsComponent);
    const comp = fixture.componentInstance;
    
    fixture.detectChanges();
    comp.openModal();
    
    comp.projectForm.patchValue({
      clientId: 'c1',
      nom: 'Test Project',
      dateDebut: '2024-01-01',
      statut: 'enCours',
      typeFacturation: 'forfait',
      montantForfait: 1000
    });

    await comp.onSubmit();
    
    expect(mockProjectsGateway.create).toHaveBeenCalled();
    const payload = (mockProjectsGateway.create as ReturnType<typeof vi.fn>).mock.calls[0][0];
    
    // Since typeFacturation is 'forfait', tauxHoraire should be deleted from payload
    expect(payload).not.toHaveProperty('tauxHoraire');
    expect(payload).not.toHaveProperty('heuresBanqueTotales');
    expect(payload).toHaveProperty('montantForfait', 1000);
    
    expect(comp.isModalOpen()).toBe(false);
  });
});
