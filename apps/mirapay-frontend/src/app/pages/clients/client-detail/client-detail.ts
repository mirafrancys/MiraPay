import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ClientsGateway } from '../../../cores/gateways/clients.gateway';
import { BankHoursGateway } from '../../../cores/gateways/bank-hours.gateway';
import { Client, BankHour } from '@mirapay/shared-models';
import { TranslationService } from '../../../cores/services/translation.service';

@Component({
  selector: 'app-client-detail',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './client-detail.html',
  styleUrl: './client-detail.scss'
})
export class ClientDetailComponent implements OnInit {
  route = inject(ActivatedRoute);
  clientsGateway = inject(ClientsGateway);
  bankGateway = inject(BankHoursGateway);
  fb = inject(FormBuilder);
  ts = inject(TranslationService);

  client = signal<Client | null>(null);
  isModalOpen = signal<boolean>(false);
  bankForm!: FormGroup;

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.loadClient(id);
    }
    this.initForm();
  }

  initForm() {
    this.bankForm = this.fb.group({
      nom: ['', Validators.required],
      description: [''],
      heuresAchetees: [null, [Validators.required, Validators.min(1)]],
      dateDebut: [''],
      dateFin: [''],
      estActive: [true]
    });
  }

  async loadClient(id: string) {
    try {
      const data = await this.clientsGateway.getOne(id);
      this.client.set(data);
    } catch (error) {
      console.error('Erreur chargement client', error);
    }
  }

  openModal() {
    this.bankForm.reset({ estActive: true });
    this.isModalOpen.set(true);
  }

  closeModal() {
    this.isModalOpen.set(false);
  }

  async onSubmit() {
    if (this.bankForm.invalid || !this.client()) return;

    try {
      const payload = {
        ...this.bankForm.value,
        clientId: this.client()!.id
      };
      
      await this.bankGateway.create(payload);
      this.closeModal();
      this.loadClient(this.client()!.id); // Rafraîchir
    } catch (error) {
      console.error('Erreur creation banque d\'heure', error);
      alert('Erreur: ' + (error as Error).message);
    }
  }
}
