import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { TimeEntriesGateway } from '../../cores/gateways/time-entries.gateway';
import { ProjectsGateway } from '../../cores/gateways/projects.gateway';
import { TasksGateway } from '../../cores/gateways/tasks.gateway';
import { TranslationService } from '../../cores/services/translation.service';
import { AuthGateway } from '../../cores/gateways/auth.gateway';
import { ITimeEntry, IProject, ITask } from '@mirapay/shared-models';
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'app-time-entries',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './time-entries.html',
  styleUrl: './time-entries.scss'
})
export class TimeEntriesComponent implements OnInit {
  ts = inject(TranslationService);
  private authGateway = inject(AuthGateway);
  private timeGateway = inject(TimeEntriesGateway);
  private projectsGateway = inject(ProjectsGateway);
  private tasksGateway = inject(TasksGateway);
  private fb = inject(FormBuilder);

  entries = signal<ITimeEntry[]>([]);
  projects = signal<IProject[]>([]);
  tasks = signal<ITask[]>([]); // Tâches du projet sélectionné
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
      this.entries.set(await firstValueFrom(this.timeGateway.getAll()));
      this.projects.set(await firstValueFrom(this.projectsGateway.getAll()));
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
        const list = await firstValueFrom(this.tasksGateway.getByProject(projectId));
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

      // Ajouter le userId de l'utilisateur connecté
      const user = this.authGateway.currentUser();
      if (user) {
        payload.userId = user.id;
      } else {
        throw new Error("L'utilisateur n'est pas connecté.");
      }

      // Formater la date pour Prisma
      payload.date = new Date(payload.date);

      await firstValueFrom(this.timeGateway.create(payload));
      this.closeModal();
      this.loadData(); // Actualiser
    } catch (error) {
      console.error('Erreur lors de la déclaration du temps', error);
      alert('Erreur : ' + (error as Error).message);
    }
  }
}
