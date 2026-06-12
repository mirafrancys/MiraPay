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

  it('should open modal', () => {
    const fixture = TestBed.createComponent(ProjectsComponent);
    const comp = fixture.componentInstance;
    
    fixture.detectChanges();
    
    comp.openModal();
    expect(comp.isModalOpen()).toBe(true);
    expect(comp.projectToEdit()).toBeNull();
  });

  it('should save new project via gateway on onSaveProject', async () => {
    const fixture = TestBed.createComponent(ProjectsComponent);
    const comp = fixture.componentInstance;
    
    fixture.detectChanges();
    comp.openModal();
    
    const payload = {
      clientId: 'c1',
      nom: 'Test Project',
      dateDebut: '2024-01-01',
      statut: 'enCours',
      typeFacturation: 'forfait',
      montantForfait: 1000
    };

    await comp.onSaveProject(payload);
    
    expect(mockProjectsGateway.create).toHaveBeenCalledWith(payload);
    expect(comp.isModalOpen()).toBe(false);
  });

  it('should update project via gateway on onSaveProject if projectToEdit is set', async () => {
    const fixture = TestBed.createComponent(ProjectsComponent);
    const comp = fixture.componentInstance;
    
    fixture.detectChanges();
    
    const existingProject = { id: 'p1', nom: 'Existing' };
    comp.openModal(existingProject as any);
    
    expect(comp.projectToEdit()?.id).toBe('p1');

    const payload = { nom: 'Updated' };
    mockProjectsGateway.update = vi.fn().mockReturnValue(of({}));

    await comp.onSaveProject(payload);
    
    expect(mockProjectsGateway.update).toHaveBeenCalledWith('p1', payload);
    expect(comp.isModalOpen()).toBe(false);
  });
});
