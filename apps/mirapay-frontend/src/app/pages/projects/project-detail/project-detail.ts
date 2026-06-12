import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule, Router } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ProjectsGateway } from '../../../cores/gateways/projects.gateway';
import { TasksGateway } from '../../../cores/gateways/tasks.gateway';
import { ClientsGateway } from '../../../cores/gateways/clients.gateway';
import { IProject, ITask, IClient } from '@mirapay/shared-models';
import { TranslationService } from '../../../cores/services/translation.service';
import { ProjectEditDlgComponent } from '../../../components/projects/project-edit-dlg/project-edit-dlg';
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'app-project-detail',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule, ProjectEditDlgComponent],
  templateUrl: './project-detail.html',
  styleUrl: './project-detail.scss'
})
export class ProjectDetailComponent implements OnInit {
  route = inject(ActivatedRoute);
  router = inject(Router);
  projectsGateway = inject(ProjectsGateway);
  tasksGateway = inject(TasksGateway);
  clientsGateway = inject(ClientsGateway);
  fb = inject(FormBuilder);
  ts = inject(TranslationService);

  project = signal<IProject | null>(null);
  tasks = signal<ITask[]>([]);
  clients = signal<IClient[]>([]);
  isModalOpen = signal<boolean>(false);
  isProjectModalOpen = signal<boolean>(false);
  taskForm!: FormGroup;

  async ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.loadProject(id);
      this.loadTasks(id);
    }
    this.initForm();
    
    try {
      this.clients.set(await firstValueFrom(this.clientsGateway.getAll()));
    } catch (e) {
      console.error('Erreur chargement clients', e);
    }
  }

  initForm() {
    this.taskForm = this.fb.group({
      titre: ['', Validators.required],
      description: [''],
      type: ['analyse', Validators.required],
      tacheFacturable: [true],
      priorite: ['normale', Validators.required],
      statut: ['new', Validators.required],
      dateDebutPrevue: [''],
      dateEcheance: ['']
    });
  }

  async loadProject(id: string) {
    try {
      const data = await firstValueFrom(this.projectsGateway.getOne(id));
      this.project.set(data);
      this.projectsGateway.activeProject.set(data);
    } catch (error) {
      console.error('Erreur chargement projet', error);
    }
  }

  closeProject() {
    this.projectsGateway.activeProject.set(null);
    this.router.navigate(['/projects']);
  }

  openEditModal() {
    this.isProjectModalOpen.set(true);
  }

  async onSaveProject(payload: Partial<IProject>) {
    try {
      const currentProject = this.project();
      if (currentProject) {
        await firstValueFrom(this.projectsGateway.update(currentProject.id, payload));
        this.loadProject(currentProject.id); // Refresh
      }
      this.isProjectModalOpen.set(false);
    } catch (error) {
      console.error('Erreur lors de la sauvegarde du projet', error);
      alert('Erreur: ' + (error as Error).message);
    }
  }

  async loadTasks(projectId: string) {
    try {
      this.tasks.set(await firstValueFrom(this.tasksGateway.getByProject(projectId)));
    } catch (error) {
      console.error('Erreur chargement tâches', error);
    }
  }

  openModal() {
    this.taskForm.reset({
      type: 'analyse',
      tacheFacturable: true,
      priorite: 'normale',
      statut: 'new'
    });
    this.isModalOpen.set(true);
  }

  closeModal() {
    this.isModalOpen.set(false);
  }

  async onSubmit() {
    const currentProject = this.project();
    if (this.taskForm.invalid || !currentProject) return;

    try {
      const payload = {
        ...this.taskForm.value,
        projetId: currentProject.id
      };
      
      // Cleanup dates before sending if empty
      if (!payload.dateDebutPrevue) delete payload.dateDebutPrevue;
      if (!payload.dateEcheance) delete payload.dateEcheance;

      await firstValueFrom(this.tasksGateway.create(payload));
      this.closeModal();
      this.loadTasks(currentProject.id); // Rafraîchir
    } catch (error) {
      console.error('Erreur creation tâche', error);
      alert('Erreur: ' + (error as Error).message);
    }
  }

  getPriorityClass(priority: string): string {
    switch (priority) {
      case 'haute': return 'badge-danger';
      case 'normale': return 'badge-warning';
      case 'basse': return 'badge-success';
      default: return 'badge-secondary';
    }
  }

  getStatusClass(status: string): string {
    switch (status) {
      case 'terminer': return 'badge-success';
      case 'en_cours': return 'badge-info';
      case 'fermer': return 'badge-secondary';
      default: return 'badge-light';
    }
  }
}
