import { ComponentFixture, TestBed } from '@angular/core/testing';
import { describe, it, expect, beforeEach } from 'vitest';
import { ProjectCardComponent } from './project-card';
import { IProject } from '@mirapay/shared-models';
import { TranslationService } from '../../../cores/services/translation.service';
import { vi } from 'vitest';

describe('ProjectCardComponent', () => {
  let component: ProjectCardComponent;
  let fixture: ComponentFixture<ProjectCardComponent>;

  beforeEach(async () => {
    const mockTranslationService = {
      translate: vi.fn((key: string) => key)
    };

    await TestBed.configureTestingModule({
      imports: [ProjectCardComponent],
      providers: [
        { provide: TranslationService, useValue: mockTranslationService }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(ProjectCardComponent);
    component = fixture.componentInstance;
    
    // Fournir un objet projet valide pour satisfaire @Input({ required: true })
    component.project = {
      id: '1',
      clientId: 'c1',
      nom: 'Test Project',
      dateDebut: new Date(),
      statut: 'enCours',
      typeFacturation: 'horaire',
      heuresBanqueConsommees: 0,
      progression: 50,
      budgetMontantPrevu: 1000,
      createdAt: new Date(),
      updatedAt: new Date(),
      client: {
        id: 'c1',
        nomLegal: 'Test Client',
        typeClient: 'entreprise',
        adresseLigne1: '',
        ville: '',
        province: '',
        codePostal: '',
        pays: '',
        courriel: '',
        telephone: '',
        modeFacturationParDefaut: '',
        deviseParDefaut: 'CAD',
        clientTaxable: true,
        appliquerTPS: true,
        appliquerTVQ: true,
        estArchive: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      }
    } as IProject;
  });

  it('should create the component', () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it('should display the project title and client name', () => {
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('.title')?.textContent).toContain('Test Project');
    expect(compiled.querySelector('.client-name')?.textContent).toContain('Test Client');
  });

  it('should correctly bind the progression width', () => {
    fixture.detectChanges();
    const progressBar = fixture.nativeElement.querySelector('.progress-bar-fill') as HTMLElement;
    // Style will be applied as 'width: 50%;'
    expect(progressBar.style.width).toBe('50%');
  });
});
