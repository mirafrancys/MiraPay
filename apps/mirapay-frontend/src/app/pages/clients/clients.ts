import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ClientsGateway } from '../../cores/gateways/clients.gateway';
import { TranslationService } from '../../cores/services/translation.service';
import { IClient } from '@mirapay/shared-models';
import { firstValueFrom } from 'rxjs';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-clients',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './clients.html',
  styleUrl: './clients.scss'
})
export class ClientsComponent implements OnInit {
  ts = inject(TranslationService);
  private clientsGateway = inject(ClientsGateway);
  private fb = inject(FormBuilder);

  clients = signal<IClient[]>([]);
  isModalOpen = signal<boolean>(false);
  clientForm!: FormGroup;

  ngOnInit() {
    this.initForm();
    this.loadClients();
  }

  initForm() {
    this.clientForm = this.fb.group({
      typeClient: ['entreprise', Validators.required],
      nomLegal: ['', Validators.required],
      adresseLigne1: ['', Validators.required],
      adresseLigne2: [''],
      ville: ['', Validators.required],
      province: ['', Validators.required],
      codePostal: ['', Validators.required],
      pays: ['Canada', Validators.required],
      courriel: ['', [Validators.required, Validators.email]],
      telephone: ['', Validators.required],
      modeFacturationParDefaut: ['horaire', Validators.required],
      deviseParDefaut: ['CAD', Validators.required],
      clientTaxable: [true],
      appliquerTPS: [true],
      appliquerTVQ: [true]
    });
  }

  async loadClients() {
    try {
      this.clients.set(await firstValueFrom(this.clientsGateway.getAll()));
    } catch (error) {
      console.error('Erreur lors du chargement des clients', error);
    }
  }

  openModal() {
    this.clientForm.reset({
      typeClient: 'entreprise',
      pays: 'Canada',
      modeFacturationParDefaut: 'horaire',
      deviseParDefaut: 'CAD',
      clientTaxable: true,
      appliquerTPS: true,
      appliquerTVQ: true
    });
    this.isModalOpen.set(true);
  }

  closeModal() {
    this.isModalOpen.set(false);
  }

  async onSubmit() {
    if (this.clientForm.invalid) return;

    try {
      const payload = this.clientForm.value;
      await firstValueFrom(this.clientsGateway.create(payload));
      this.closeModal();
      this.loadClients(); // Actualiser la liste
    } catch (error) {
      console.error('Erreur lors de la création du client', error);
      alert('Erreur lors de la création du client : ' + (error as Error).message);
    }
  }
}
