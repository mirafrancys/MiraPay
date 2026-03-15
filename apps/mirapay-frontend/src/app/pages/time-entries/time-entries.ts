import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TimeEntriesGateway } from '../../cores/gateways/time-entries.gateway';
import { TranslationService } from '../../cores/services/translation.service';

@Component({
  selector: 'app-time-entries',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="page-container" style="padding: 2rem;">
      <div class="page-header" style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 2rem;">
        <h1 style="margin: 0;">{{ts.translate('COMMON.TIME_ENTRIES')}}</h1>
        <button style="background: #2563eb; color: white; border: none; padding: 0.75rem 1.5rem; border-radius: 8px; cursor: pointer; font-weight: 500;">
          ⏱️ Déclarer du Temps
        </button>
      </div>

      <div class="list-container" style="background: white; border-radius: 12px; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.1); padding: 1.5rem;">
        <table style="width: 100%; border-collapse: collapse; text-align: left;">
          <thead>
            <tr style="border-bottom: 1px solid #e2e8f0; color: #64748b; font-size: 0.875rem;">
              <th style="padding: 1rem;">Date</th>
              <th style="padding: 1rem;">Projet</th>
              <th style="padding: 1rem;">Durée (Heures)</th>
              <th style="padding: 1rem;">Statut</th>
            </tr>
          </thead>
          <tbody>
            @for (entry of entries(); track entry.id) {
            <tr style="border-bottom: 1px solid #f1f5f9;">
              <td style="padding: 1rem;">{{entry.date | date:'shortDate'}}</td>
              <td style="padding: 1rem; font-weight: 500;">{{entry.projet?.nom}}</td>
              <td style="padding: 1rem;">{{entry.dureeHeures}} h</td>
              <td style="padding: 1rem;">
                <span [style.background]="entry.statut === 'valide' ? '#dff6dd' : '#fef3c7'" 
                      [style.color]="entry.statut === 'valide' ? '#1e4620' : '#d97706'"
                      style="padding: 0.25rem 0.5rem; border-radius: 9999px; font-size: 0.75rem; font-weight: 500;">
                  {{entry.statut}}
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
export class TimeEntriesComponent implements OnInit {
  ts = inject(TranslationService);
  private timeGateway = inject(TimeEntriesGateway);
  entries = signal<any[]>([]);

  async ngOnInit() {
    this.entries.set(await this.timeGateway.getAll());
  }
}
