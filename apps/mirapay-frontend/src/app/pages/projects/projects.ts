import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProjectsGateway } from '../../cores/gateways/projects.gateway';
import { TranslationService } from '../../cores/services/translation.service';

@Component({
  selector: 'app-projects',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="page-container" style="padding: 2rem;">
      <div class="page-header" style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 2rem;">
        <h1 style="margin: 0;">{{ts.translate('COMMON.PROJECTS')}}</h1>
        <button style="background: #2563eb; color: white; border: none; padding: 0.75rem 1.5rem; border-radius: 8px; cursor: pointer; font-weight: 500;">
          ➕ Créer un Projet
        </button>
      </div>

      <div class="list-container" style="background: white; border-radius: 12px; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.1); padding: 1.5rem;">
        <table style="width: 100%; border-collapse: collapse; text-align: left;">
          <thead>
            <tr style="border-bottom: 1px solid #e2e8f0; color: #64748b; font-size: 0.875rem;">
              <th style="padding: 1rem;">Nom du Projet</th>
              <th style="padding: 1rem;">Client</th>
              <th style="padding: 1rem;">Taux Horaire</th>
              <th style="padding: 1rem;">Statut</th>
            </tr>
          </thead>
          <tbody>
            @for (project of projects(); track project.id) {
            <tr style="border-bottom: 1px solid #f1f5f9;">
              <td style="padding: 1rem; font-weight: 500;">{{project.nom}}</td>
              <td style="padding: 1rem;">{{project.client?.nomLegal}}</td>
              <td style="padding: 1rem;">{{project.tauxHoraire | currency:'CAD'}}</td>
              <td style="padding: 1rem;">
                <span style="padding: 0.25rem 0.5rem; border-radius: 9999px; font-size: 0.75rem; font-weight: 500; background: #dff6dd; color: #1e4620;">
                  {{project.statut}}
                </span>
              </td>
            </tr>
            }
          </tbody>
        </table>
      </div>
    </div>
  `
})
export class ProjectsComponent implements OnInit {
  ts = inject(TranslationService);
  private projectsGateway = inject(ProjectsGateway);
  projects = signal<any[]>([]);

  async ngOnInit() {
    this.projects.set(await this.projectsGateway.getAll());
  }
}
