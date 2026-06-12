import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ProjectsGateway } from '../../cores/gateways/projects.gateway';
import { ClientsGateway } from '../../cores/gateways/clients.gateway';
import { TranslationService } from '../../cores/services/translation.service';
import { IProject, IClient } from '@mirapay/shared-models';
import { firstValueFrom } from 'rxjs';
import { ProjectEditDlgComponent } from '../../components/projects/project-edit-dlg/project-edit-dlg';

@Component({
  selector: 'app-projects',
  standalone: true,
  imports: [CommonModule, RouterModule, ProjectEditDlgComponent],
  templateUrl: './projects.html',
  styleUrl: './projects.scss'
})
export class ProjectsComponent implements OnInit {
  ts = inject(TranslationService);
  private projectsGateway = inject(ProjectsGateway);
  private clientsGateway = inject(ClientsGateway);

  projects = signal<IProject[]>([]);
  clients = signal<IClient[]>([]);
  isModalOpen = signal<boolean>(false);
  projectToEdit = signal<IProject | null>(null);

  ngOnInit() {
    this.loadData();
  }

  async loadData() {
    try {
      this.projects.set(await firstValueFrom(this.projectsGateway.getAll()));
      this.clients.set(await firstValueFrom(this.clientsGateway.getAll()));
    } catch (error) {
      console.error('Erreur lors du chargement des données', error);
    }
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
      console.error('Erreur lors de la sauvegarde du projet', error);
      alert('Erreur lors de la sauvegarde : ' + (error as Error).message);
    }
  }
}
