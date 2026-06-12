import { ComponentFixture, TestBed } from '@angular/core/testing';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { provideHttpClient } from '@angular/common/http';
import { of, throwError } from 'rxjs';

import { ProjectDashboardComponent } from './project-dashboard';
import { ProjectsGateway } from '../../cores/gateways/projects.gateway';
import { ClientsGateway } from '../../cores/gateways/clients.gateway';
import { TranslationService } from '../../cores/services/translation.service';
import { IProject, IClient } from '@mirapay/shared-models';

describe('ProjectDashboardComponent', () => {
  let component: ProjectDashboardComponent;
  let fixture: ComponentFixture<ProjectDashboardComponent>;
  let mockProjectsGateway: Partial<ProjectsGateway>;
  let mockClientsGateway: Partial<ClientsGateway>;
  let mockTranslationService: Partial<TranslationService>;

  const mockProjects: IProject[] = [
    { id: '1', nom: 'Project 1', statut: 'brouillon', clientId: 'c1', budgetMontantPrevu: 100 } as IProject,
    { id: '2', nom: 'Project 2', statut: 'enCours', clientId: 'c2', budgetMontantPrevu: 200 } as IProject,
  ];

  const mockClients: IClient[] = [
    { id: 'c1', nomLegal: 'Client A' } as IClient,
    { id: 'c2', nomLegal: 'Client B' } as IClient,
  ];

  beforeEach(async () => {
    mockProjectsGateway = {
      getAll: vi.fn().mockReturnValue(of(mockProjects)),
      update: vi.fn().mockReturnValue(of({ ...mockProjects[0], statut: 'enCours' })),
    };

    mockClientsGateway = {
      getAll: vi.fn().mockReturnValue(of(mockClients)),
    };

    mockTranslationService = {
      translate: vi.fn((key: string) => key),
      getLanguage: vi.fn().mockReturnValue('fr'),
      setLanguage: vi.fn(),
    };

    await TestBed.configureTestingModule({
      imports: [ProjectDashboardComponent],
      providers: [
        provideHttpClient(),
        { provide: ProjectsGateway, useValue: mockProjectsGateway },
        { provide: ClientsGateway, useValue: mockClientsGateway },
        { provide: TranslationService, useValue: mockTranslationService },
      ],
    }).compileComponents();
  });

  beforeEach(async () => {
    fixture = TestBed.createComponent(ProjectDashboardComponent);
    component = fixture.componentInstance;
    // La méthode loadData est appelée dans le ngOnInit
    fixture.detectChanges();
    await component.loadData();
  });

  it('should create the component and load initial data', () => {
    expect(component).toBeTruthy();
    expect(component.projects().length).toBe(2);
    expect(component.clients().length).toBe(2);
    expect(component.isLoading()).toBe(false);
  });

  it('should group projects by status and calculate total budget', () => {
    const groups = component.groupedProjects();
    expect(groups['brouillon'].projects.length).toBe(1);
    expect(groups['brouillon'].totalBudget).toBe(100);

    expect(groups['enCours'].projects.length).toBe(1);
    expect(groups['enCours'].totalBudget).toBe(200);

    expect(groups['termine'].projects.length).toBe(0);
    expect(groups['termine'].totalBudget).toBe(0);
  });

  it('should filter projects based on search query', () => {
    // Modifier la recherche via le signal
    component.searchQuery.set('Project 1');
    const filtered = component.filteredProjects();
    
    expect(filtered.length).toBe(1);
    expect(filtered[0].id).toBe('1');
  });

  it('should filter projects based on selected client', () => {
    component.selectedClientId.set('c2');
    const filtered = component.filteredProjects();
    
    expect(filtered.length).toBe(1);
    expect(filtered[0].id).toBe('2');
  });

  it('should optimistically update project status on drop and call Gateway', async () => {
    const dropEvent = { projectId: '1', targetStatus: 'enCours' };
    
    await component.onProjectDropped(dropEvent);
    
    expect(mockProjectsGateway.update).toHaveBeenCalledWith('1', { statut: 'enCours' });
    // Vérifier la mise à jour optimiste
    const project1 = component.projects().find(p => p.id === '1');
    expect(project1?.statut).toBe('enCours');
  });

  it('should rollback optimistic update if Gateway fails', async () => {
    const errorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    // Simuler une erreur HTTP
    mockProjectsGateway.update = vi.fn().mockReturnValue(throwError(() => new Error('API Error')));
    
    const dropEvent = { projectId: '1', targetStatus: 'termine' };
    
    await component.onProjectDropped(dropEvent);
    
    // Le projet doit revenir à son état initial ('brouillon')
    const project1 = component.projects().find(p => p.id === '1');
    expect(project1?.statut).toBe('brouillon');
    
    errorSpy.mockRestore();
  });
});
