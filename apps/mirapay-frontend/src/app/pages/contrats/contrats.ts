import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ContratsGateway } from '../../cores/gateways/contrats.gateway';
import { ClientsGateway } from '../../cores/gateways/clients.gateway';
import { TranslationService } from '../../cores/services/translation.service';
import { Contrat, Client } from '@mirapay/shared-models';

@Component({
  selector: 'app-contrats',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './contrats.html',
  styleUrl: './contrats.scss'
})
export class ContratsComponent implements OnInit {
  ts = inject(TranslationService);
  private contratsGateway = inject(ContratsGateway);
  private clientsGateway = inject(ClientsGateway);
  private fb = inject(FormBuilder);

  contrats = signal<Contrat[]>([]);
  clients = signal<Client[]>([]);
  isModalOpen = signal<boolean>(false);
  contratForm!: FormGroup;

  ngOnInit() {
    this.initForm();
    this.loadData();
  }

  initForm() {
    this.contratForm = this.fb.group({
      clientId: ['', Validators.required],
      numero: ['', Validators.required],
      dateDebut: ['', Validators.required],
      dateFin: [''],
      typeContrat: ['horaire', Validators.required],
      conditionsSpeciales: [''],
      montantTotalContrat: [null]
    });
  }

  async loadData() {
    try {
      this.contrats.set(await this.contratsGateway.getAll());
      this.clients.set(await this.clientsGateway.getAll());
    } catch (error) {
      console.error('Erreur chargement contrats', error);
    }
  }

  openModal() {
    this.contratForm.reset({ numero: 'CTR-' + Date.now(), typeContrat: 'horaire' });
    this.isModalOpen.set(true);
  }

  closeModal() {
    this.isModalOpen.set(false);
  }

  async onSubmit() {
    if (this.contratForm.invalid) return;

    try {
      const payload = this.contratForm.value;
      await this.contratsGateway.create(payload);
      this.closeModal();
      this.loadData();
    } catch (error) {
      console.error('Erreur creation contrat', error);
      alert('Erreur: ' + (error as Error).message);
    }
  }
}
