import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { ProjectsGateway } from '../../cores/gateways/projects.gateway';
import { ClientsGateway } from '../../cores/gateways/clients.gateway';
import { TranslationService } from '../../cores/services/translation.service';
import { Project, Client } from '@mirapay/shared-models';

@Component({
  selector: 'app-projects',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './projects.html',
  styleUrl: './projects.scss'
})
export class ProjectsComponent implements OnInit {
  ts = inject(TranslationService);
  private projectsGateway = inject(ProjectsGateway);
  private clientsGateway = inject(ClientsGateway);
  private fb = inject(FormBuilder);

  projects = signal<Project[]>([]);
  clients = signal<Client[]>([]);
  isModalOpen = signal<boolean>(false);
  projectForm!: FormGroup;

  ngOnInit() {
    this.initForm();
    this.loadData();
  }

  initForm() {
    this.projectForm = this.fb.group({
      clientId: ['', Validators.required],
      nom: ['', Validators.required],
      description: [''],
      dateDebut: [new Date().toISOString().substring(0, 10), Validators.required],
      dateFinPrevue: [''],
      statut: ['enCours', Validators.required],
      typeFacturation: ['horaire', Validators.required],
      tauxHoraire: [null],
      montantForfait: [null],
      heuresBanqueTotales: [null]
    });
  }

  async loadData() {
    try {
      this.projects.set(await this.projectsGateway.getAll());
      this.clients.set(await this.clientsGateway.getAll());
    } catch (error) {
      console.error('Erreur lors du chargement des données', error);
    }
  }

  openModal() {
    this.projectForm.reset({
      statut: 'enCours',
      typeFacturation: 'horaire',
      dateDebut: new Date().toISOString().substring(0, 10)
    });
    this.isModalOpen.set(true);
  }

  closeModal() {
    this.isModalOpen.set(false);
  }

  async onSubmit() {
    if (this.projectForm.invalid) return;

    try {
      const payload = this.projectForm.value;
      if (payload.typeFacturation !== 'horaire') delete payload.tauxHoraire;
      if (payload.typeFacturation !== 'forfait') delete payload.montantForfait;
      if (payload.typeFacturation !== 'banqueHeures') delete payload.heuresBanqueTotales;

      if (payload.dateFinPrevue === '') delete payload.dateFinPrevue;

      await this.projectsGateway.create(payload);
      this.closeModal();
      this.loadData();
    } catch (error) {
      console.error('Erreur lors de la création du projet', error);
      alert('Erreur lors de la création du projet : ' + (error as Error).message);
    }
  }
}
