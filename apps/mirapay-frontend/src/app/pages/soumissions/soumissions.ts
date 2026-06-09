import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormArray, ReactiveFormsModule, Validators } from '@angular/forms';
import { SoumissionsGateway } from '../../cores/gateways/soumissions.gateway';
import { ClientsGateway } from '../../cores/gateways/clients.gateway';
import { TranslationService } from '../../cores/services/translation.service';
import { ISoumission, IClient } from '@mirapay/shared-models';

@Component({
  selector: 'app-soumissions',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './soumissions.html',
  styleUrl: './soumissions.scss'
})
export class SoumissionsComponent implements OnInit {
  ts = inject(TranslationService);
  private soumissionsGateway = inject(SoumissionsGateway);
  private clientsGateway = inject(ClientsGateway);
  private fb = inject(FormBuilder);

  soumissions = signal<ISoumission[]>([]);
  clients = signal<IClient[]>([]);
  isModalOpen = signal<boolean>(false);
  soumissionForm!: FormGroup;

  ngOnInit() {
    this.initForm();
    this.loadData();
  }

  initForm() {
    this.soumissionForm = this.fb.group({
      clientId: ['', Validators.required],
      titre: ['', Validators.required],
      numero: ['', Validators.required],
      description: [''],
      dateValidite: [''],
      lines: this.fb.array([])
    });
    this.addLine(); // Ajouter une ligne par défaut
  }

  get lines(): FormArray {
    return this.soumissionForm.get('lines') as FormArray;
  }

  addLine() {
    const group = this.fb.group({
      description: ['', Validators.required],
      quantite: [1, [Validators.required, Validators.min(0.5)]],
      prixUnitaire: [0, [Validators.required, Validators.min(0)]],
      montantLigne: [{ value: 0, disabled: true }],
      typeLigne: ['service', Validators.required]
    });
    
    // Calcul automatique du total ligne
    group.valueChanges.subscribe(val => {
      const total = (val.quantite || 0) * (val.prixUnitaire || 0);
      group.patchValue({ montantLigne: total }, { emitEvent: false });
    });

    this.lines.push(group);
  }

  removeLine(index: number) {
    this.lines.removeAt(index);
  }

  async loadData() {
    try {
      this.soumissions.set(await this.soumissionsGateway.getAll());
      this.clients.set(await this.clientsGateway.getAll());
    } catch (error) {
      console.error('Erreur chargement soumissions', error);
    }
  }

  openModal() {
    this.lines.clear();
    this.soumissionForm.reset({ numero: 'SMI-' + Date.now() });
    this.addLine();
    this.isModalOpen.set(true);
  }

  closeModal() {
    this.isModalOpen.set(false);
  }

  async onSubmit() {
    if (this.soumissionForm.invalid) return;

    try {
      // Pour le payload, on extrait la valeur pure (incluant les désactivés)
      const payload = this.soumissionForm.getRawValue();
      
      // Calculer sousTotalHT
      payload.sousTotalHT = payload.lines.reduce((acc: number, line: any) => acc + (line.quantite * line.prixUnitaire), 0);
      payload.montantTPS = payload.sousTotalHT * 0.05; // Fixe pour démo
      payload.montantTVQ = payload.sousTotalHT * 0.09975;
      payload.totalTTC = payload.sousTotalHT + payload.montantTPS + payload.montantTVQ;

      await this.soumissionsGateway.create(payload);
      this.closeModal();
      this.loadData();
    } catch (error) {
      console.error('Erreur creation soumission', error);
      alert('Erreur: ' + (error as Error).message);
    }
  }
}
