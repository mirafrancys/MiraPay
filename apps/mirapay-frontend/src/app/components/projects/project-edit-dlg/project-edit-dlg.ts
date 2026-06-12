import { Component, EventEmitter, Input, OnInit, Output, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { IProject, IClient } from '@mirapay/shared-models';
import { TranslationService } from '../../../cores/services/translation.service';

@Component({
  selector: 'app-project-edit-dlg',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './project-edit-dlg.html',
  styleUrls: ['./project-edit-dlg.scss']
})
export class ProjectEditDlgComponent implements OnInit {
  ts = inject(TranslationService);
  private fb = inject(FormBuilder);

  @Input({ required: true }) clients: IClient[] = [];
  @Input() projectToEdit: IProject | null = null;
  
  @Output() closeDialog = new EventEmitter<void>();
  @Output() saveProject = new EventEmitter<Partial<IProject>>();

  projectForm!: FormGroup;

  ngOnInit() {
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

    if (this.projectToEdit) {
      this.projectForm.patchValue({
        ...this.projectToEdit,
        dateDebut: typeof this.projectToEdit.dateDebut === 'string' ? this.projectToEdit.dateDebut.substring(0, 10) : new Date(this.projectToEdit.dateDebut).toISOString().substring(0, 10),
        dateFinPrevue: this.projectToEdit.dateFinPrevue ? (typeof this.projectToEdit.dateFinPrevue === 'string' ? this.projectToEdit.dateFinPrevue.substring(0, 10) : new Date(this.projectToEdit.dateFinPrevue).toISOString().substring(0, 10)) : ''
      });
    } else {
      this.projectForm.reset({
        statut: 'enCours',
        typeFacturation: 'horaire',
        dateDebut: new Date().toISOString().substring(0, 10)
      });
    }
  }

  onSubmit() {
    if (this.projectForm.invalid) return;

    const payload = this.projectForm.value;
    if (payload.typeFacturation !== 'horaire') delete payload.tauxHoraire;
    if (payload.typeFacturation !== 'forfait') delete payload.montantForfait;
    if (payload.typeFacturation !== 'banqueHeures') delete payload.heuresBanqueTotales;
    if (payload.dateFinPrevue === '') delete payload.dateFinPrevue;

    this.saveProject.emit(payload);
  }

  onCancel() {
    this.closeDialog.emit();
  }
}
