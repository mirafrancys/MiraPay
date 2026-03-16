import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule, Router } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ProjectsGateway } from '../../../cores/gateways/projects.gateway';
import { TasksGateway } from '../../../cores/gateways/tasks.gateway';
import { Project, Task } from '@mirapay/shared-models';
import { TranslationService } from '../../../cores/services/translation.service';

@Component({
  selector: 'app-project-detail',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './project-detail.html',
  styleUrl: './project-detail.scss'
})
export class ProjectDetailComponent implements OnInit {
  route = inject(ActivatedRoute);
  router = inject(Router);
  projectsGateway = inject(ProjectsGateway);
  tasksGateway = inject(TasksGateway);
  fb = inject(FormBuilder);
  ts = inject(TranslationService);

  project = signal<Project | null>(null);
  tasks = signal<Task[]>([]);
  isModalOpen = signal<boolean>(false);
  taskForm!: FormGroup;

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.loadProject(id);
      this.loadTasks(id);
    }
    this.initForm();
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
      this.project.set(await this.projectsGateway.getOne(id));
    } catch (error) {
      console.error('Erreur chargement projet', error);
    }
  }

  async loadTasks(projectId: string) {
    try {
      this.tasks.set(await this.tasksGateway.getByProject(projectId));
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

      await this.tasksGateway.create(payload);
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
