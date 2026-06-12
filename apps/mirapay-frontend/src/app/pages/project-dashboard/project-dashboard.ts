import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { firstValueFrom } from 'rxjs';
import { IProject, IClient } from '@mirapay/shared-models';

import { ProjectsGateway } from '../../cores/gateways/projects.gateway';
import { ClientsGateway } from '../../cores/gateways/clients.gateway';
import { TranslationService } from '../../cores/services/translation.service';
import { KanbanColumnComponent } from '../../components/projects/kanban-column/kanban-column';
import { ProjectEditDlgComponent } from '../../components/projects/project-edit-dlg/project-edit-dlg';

@Component({
  selector: 'app-project-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule, KanbanColumnComponent, ProjectEditDlgComponent],
  templateUrl: './project-dashboard.html',
  styleUrls: ['./project-dashboard.scss'],
})
export class ProjectDashboardComponent implements OnInit {
  private projectsGateway = inject(ProjectsGateway);
  private clientsGateway = inject(ClientsGateway);
  public ts = inject(TranslationService);

  // État local (Signals)
  projects = signal<IProject[]>([]);
  clients = signal<IClient[]>([]);
  isLoading = signal<boolean>(true);
  isModalOpen = signal<boolean>(false);
  projectToEdit = signal<IProject | null>(null);

  // Filtres
  searchQuery = signal<string>('');
  selectedClientId = signal<string>('');

  // Configuration des colonnes du Kanban
  columns = [
    { titleKey: 'PROJECTS.STATUS_DRAFT', statusKey: 'brouillon' },
    { titleKey: 'PROJECTS.STATUS_IN_PROGRESS', statusKey: 'enCours' },
    { titleKey: 'PROJECTS.STATUS_ON_HOLD', statusKey: 'enPause' },
    { titleKey: 'PROJECTS.STATUS_COMPLETED', statusKey: 'termine' }
  ];

  // Pipeline de filtrage
  filteredProjects = computed(() => {
    let filtered = this.projects();
    const query = this.searchQuery().toLowerCase().trim();
    const clientId = this.selectedClientId();

    if (query) {
      filtered = filtered.filter(p => 
        p.nom.toLowerCase().includes(query) || 
        p.client?.nomLegal?.toLowerCase().includes(query)
      );
    }

    if (clientId) {
      filtered = filtered.filter(p => p.clientId === clientId);
    }

    // On pourrait trier par ordreAffichage ici
    return filtered.sort((a, b) => (a.ordreAffichage || 0) - (b.ordreAffichage || 0));
  });

  // Groupement optimisé pour l'affichage des colonnes
  groupedProjects = computed(() => {
    const groups: Record<string, { projects: IProject[], totalBudget: number }> = {};
    
    // Initialisation
    for (const col of this.columns) {
      groups[col.statusKey] = { projects: [], totalBudget: 0 };
    }

    // Répartition
    for (const p of this.filteredProjects()) {
      if (groups[p.statut]) {
        groups[p.statut].projects.push(p);
        groups[p.statut].totalBudget += (p.budgetMontantPrevu || 0);
      }
    }

    return groups;
  });

  ngOnInit() {
    this.loadData();
  }

  async loadData() {
    this.isLoading.set(true);
    try {
      // Chargement en parallèle
      const [projectsData, clientsData] = await Promise.all([
        firstValueFrom(this.projectsGateway.getAll()),
        firstValueFrom(this.clientsGateway.getAll())
      ]);
      
      this.projects.set(projectsData);
      this.clients.set(clientsData);
    } catch (error) {
      console.error('Erreur lors du chargement des données', error);
    } finally {
      this.isLoading.set(false);
    }
  }

  // Écouteur de l'événement Drop du composant enfant
  async onProjectDropped(event: { projectId: string; targetStatus: string }) {
    // 1. Mise à jour optimiste du frontend pour l'expérience utilisateur
    const previousProjects = this.projects();
    const updatedProjects = previousProjects.map(p => 
      p.id === event.projectId ? { ...p, statut: event.targetStatus } : p
    );
    this.projects.set(updatedProjects);

    // 2. Envoi de la requête au serveur
    try {
      await firstValueFrom(this.projectsGateway.update(event.projectId, { statut: event.targetStatus }));
    } catch (error) {
      console.error('Erreur lors du déplacement du projet', error);
      // Rollback en cas d'erreur
      this.projects.set(previousProjects);
    }
  }

  // Fonctions pour mettre à jour les signaux de filtres depuis l'UI
  updateSearch(event: Event) {
    const input = event.target as HTMLInputElement;
    this.searchQuery.set(input.value);
  }

  updateClientFilter(event: Event) {
    const select = event.target as HTMLSelectElement;
    this.selectedClientId.set(select.value);
  }

  openModal(project: IProject | null = null) {
    this.projectToEdit.set(project);
    this.isModalOpen.set(true);
  }

  async onSaveProject(payload: Partial<IProject>) {
    try {
      const currentProject = this.projectToEdit();
      if (currentProject) {
        await firstValueFrom(this.projectsGateway.update(currentProject.id, payload));
      } else {
        await firstValueFrom(this.projectsGateway.create(payload));
      }
      this.isModalOpen.set(false);
      this.loadData();
    } catch (error) {
      console.error('Erreur lors de la sauvegarde', error);
      alert('Erreur lors de la sauvegarde : ' + (error as Error).message);
    }
  }
}
