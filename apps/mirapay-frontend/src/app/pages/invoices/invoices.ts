import { Component, inject, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { InvoicesGateway } from '../../cores/gateways/invoices.gateway';
import { ClientsGateway } from '../../cores/gateways/clients.gateway';
import { ProjectsGateway } from '../../cores/gateways/projects.gateway';
import { TranslationService } from '../../cores/services/translation.service';
import { IInvoice, IClient, IProject } from '@mirapay/shared-models';

@Component({
  selector: 'app-invoices',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './invoices.html',
  styleUrl: './invoices.scss'
})
export class InvoicesComponent implements OnInit {
  ts = inject(TranslationService);
  private invoicesGateway = inject(InvoicesGateway);
  private clientsGateway = inject(ClientsGateway);
  private projectsGateway = inject(ProjectsGateway);
  private fb = inject(FormBuilder);

  invoices = signal<IInvoice[]>([]);
  clients = signal<IClient[]>([]);
  projects = signal<IProject[]>([]);
  
  // Filtrer les projets par client sélectionné
  filteredProjects = computed(() => {
    const clientId = this.invoiceForm?.get('clientId')?.value;
    if (!clientId) return [];
    return this.projects().filter(p => p.clientId === clientId);
  });

  isModalOpen = signal<boolean>(false);
  invoiceForm!: FormGroup;
  draftData = signal<IInvoice | null>(null); // Aperçu du brouillon calculé

  ngOnInit() {
    this.initForm();
    this.loadData();
  }

  initForm() {
    this.invoiceForm = this.fb.group({
      clientId: ['', Validators.required],
      projetId: [''],
    });
  }

  async loadData() {
    try {
      this.invoices.set(await this.invoicesGateway.getAll());
      this.clients.set(await this.clientsGateway.getAll());
      this.projects.set(await this.projectsGateway.getAll());
    } catch (error) {
      console.error('Erreur lors du chargement des factures', error);
    }
  }

  onClientChange() {
    this.invoiceForm.get('projetId')?.setValue('');
    this.draftData.set(null); // Reset draft
  }

  onProjectChange() {
    this.draftData.set(null); // Reset draft
  }

  async prepareDraft() {
    const clientId = this.invoiceForm.get('clientId')?.value;
    const projetId = this.invoiceForm.get('projetId')?.value;

    if (!clientId) return;

    try {
      const payload: { clientId: string; projetId?: string } = { clientId };
      if (projetId) payload.projetId = projetId;

      const res = await this.invoicesGateway.prepareDraft(payload);
      this.draftData.set(res);
    } catch (error) {
      console.error('Erreur lors du calcul du brouillon', error);
      alert('Erreur lors du calcul : ' + (error as Error).message);
    }
  }

  openModal() {
    this.invoiceForm.reset({
      clientId: '',
      projetId: ''
    });
    this.draftData.set(null);
    this.isModalOpen.set(true);
  }

  closeModal() {
    this.isModalOpen.set(false);
  }

  async onSubmit() {
    if (this.invoiceForm.invalid || !this.draftData()) return;

    try {
      const payload = { ...this.invoiceForm.value };
      if (!payload.projetId || payload.projetId === '') delete payload.projetId;

      await this.invoicesGateway.create(payload);
      this.closeModal();
      this.loadData(); // actualiser
    } catch (error) {
      console.error('Erreur création facture', error);
      alert('Erreur : ' + (error as Error).message);
    }
  }
}
