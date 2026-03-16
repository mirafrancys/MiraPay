import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { TimeEntriesGateway } from '../../cores/gateways/time-entries.gateway';
import { ProjectsGateway } from '../../cores/gateways/projects.gateway';
import { TasksGateway } from '../../cores/gateways/tasks.gateway';
import { TranslationService } from '../../cores/services/translation.service';
import { TimeEntry, Project, Task } from '@mirapay/shared-models';

@Component({
  selector: 'app-time-entries',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './time-entries.html',
  styleUrl: './time-entries.scss'
})
export class TimeEntriesComponent implements OnInit {
  ts = inject(TranslationService);
  private timeGateway = inject(TimeEntriesGateway);
  private projectsGateway = inject(ProjectsGateway);
  private tasksGateway = inject(TasksGateway);
  private fb = inject(FormBuilder);

  entries = signal<TimeEntry[]>([]);
  projects = signal<Project[]>([]);
  tasks = signal<Task[]>([]); // Tâches du projet sélectionné
  isModalOpen = signal<boolean>(false);
  timeForm!: FormGroup;

  ngOnInit() {
    this.initForm();
    this.loadData();
  }

  initForm() {
    this.timeForm = this.fb.group({
      projetId: ['', Validators.required],
      tacheId: [''],
      date: [new Date().toISOString().substring(0, 10), Validators.required],
      dureeHeures: [null, [Validators.required, Validators.min(0.25)]],
      estFacturable: [true],
      commentaire: ['']
    });
  }

  async loadData() {
    try {
      this.entries.set(await this.timeGateway.getAll());
      this.projects.set(await this.projectsGateway.getAll());
    } catch (error) {
      console.error('Erreur lors du chargement des données', error);
    }
  }

  async onProjectChange(event: Event) {
    const select = event.target as HTMLSelectElement;
    const projectId = select.value;
    this.tasks.set([]); // Reset
    this.timeForm.get('tacheId')?.setValue(''); // Reset form control

    if (projectId) {
      try {
        const list = await this.tasksGateway.getByProject(projectId);
        this.tasks.set(list);
      } catch (error) {
        console.error('Erreur lors du chargement des tâches', error);
      }
    }
  }

  openModal() {
    this.timeForm.reset({
      date: new Date().toISOString().substring(0, 10),
      estFacturable: true,
      projetId: '',
      tacheId: ''
    });
    this.tasks.set([]);
    this.isModalOpen.set(true);
  }

  closeModal() {
    this.isModalOpen.set(false);
  }

  async onSubmit() {
    if (this.timeForm.invalid) return;

    try {
      const payload = { ...this.timeForm.value };
      if (!payload.tacheId || payload.tacheId === '') {
        delete payload.tacheId; // Nettoyer si vide
      }

      await this.timeGateway.create(payload);
      this.closeModal();
      this.loadData(); // Actualiser
    } catch (error) {
      console.error('Erreur lors de la déclaration du temps', error);
      alert('Erreur : ' + (error as Error).message);
    }
  }
}
