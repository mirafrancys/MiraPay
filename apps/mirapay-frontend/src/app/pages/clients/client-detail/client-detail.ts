import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule, Router } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ClientsGateway } from '../../../cores/gateways/clients.gateway';
import { BankHoursGateway } from '../../../cores/gateways/bank-hours.gateway';
import { IClient, IBankHour } from '@mirapay/shared-models';
import { TranslationService } from '../../../cores/services/translation.service';
import { ContactsGateway } from '../../../cores/gateways/contacts.gateway';
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'app-client-detail',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './client-detail.html',
  styleUrl: './client-detail.scss'
})
export class ClientDetailComponent implements OnInit {
  route = inject(ActivatedRoute);
  router = inject(Router);
  clientsGateway = inject(ClientsGateway);
  bankGateway = inject(BankHoursGateway);
  contactsGateway = inject(ContactsGateway);
  fb = inject(FormBuilder);
  ts = inject(TranslationService);

  client = signal<IClient | null>(null);
  isModalOpen = signal<boolean>(false);
  isContactModalOpen = signal<boolean>(false);
  bankForm!: FormGroup;
  contactForm!: FormGroup;

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

    this.contactForm = this.fb.group({
      nom: ['', Validators.required],
      fonction: [''],
      courriel: ['', [Validators.email]],
      telephone: ['']
    });
  }

  async loadClient(id: string) {
    try {
      const data = await firstValueFrom(this.clientsGateway.getOne(id));
      this.client.set(data);
      this.clientsGateway.activeClient.set(data);
    } catch (error) {
      console.error('Erreur chargement client', error);
    }
  }

  closeClient() {
    this.clientsGateway.activeClient.set(null);
    this.router.navigate(['/clients']);
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
      
      await firstValueFrom(this.bankGateway.create(payload));
      this.closeModal();
      this.loadClient(this.client()!.id); // Rafraîchir
    } catch (error) {
      console.error('Erreur creation banque d\'heure', error);
      alert('Erreur: ' + (error as Error).message);
    }
  }

  openContactModal() {
    this.contactForm.reset();
    this.isContactModalOpen.set(true);
  }

  closeContactModal() {
    this.isContactModalOpen.set(false);
  }

  async onSubmitContact() {
    const currentClient = this.client();
    if (this.contactForm.invalid || !currentClient) return;

    try {
      const payload = {
        ...this.contactForm.value,
        clientId: currentClient.id
      };
      
      await firstValueFrom(this.contactsGateway.create(payload));
      this.closeContactModal();
      this.loadClient(currentClient.id); // Rafraîchir
    } catch (error) {
      console.error('Erreur creation contact', error);
      alert('Erreur: ' + (error as Error).message);
    }
  }

  async deleteContact(id: string) {
    const currentClient = this.client();
    if (!currentClient || !confirm("Désactiver ce contact ? Il ne sera plus visible pour les futures opérations.")) return;
    try {
      await firstValueFrom(this.contactsGateway.delete(id));
      this.loadClient(currentClient.id);
    } catch (error) {
      console.error('Erreur delete contact', error);
    }
  }
}
