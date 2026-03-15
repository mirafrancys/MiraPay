import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ClientsGateway } from '../../cores/gateways/clients.gateway';
import { TranslationService } from '../../cores/services/translation.service';

@Component({
  selector: 'app-clients',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="page-container" style="padding: 2rem;">
      <div class="page-header" style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 2rem;">
        <h1 style="margin: 0;">{{ts.translate('COMMON.CLIENTS')}}</h1>
        <button style="background: #2563eb; color: white; border: none; padding: 0.75rem 1.5rem; border-radius: 8px; cursor: pointer; font-weight: 500;">
          ➕ Créer un Client
        </button>
      </div>

      <div class="list-container" style="background: white; border-radius: 12px; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.1); padding: 1.5rem;">
        <table style="width: 100%; border-collapse: collapse; text-align: left;">
          <thead>
            <tr style="border-bottom: 1px solid #e2e8f0; color: #64748b; font-size: 0.875rem;">
              <th style="padding: 1rem;">Nom</th>
              <th style="padding: 1rem;">Courriel</th>
              <th style="padding: 1rem;">Téléphone</th>
              <th style="padding: 1rem;">Projets</th>
            </tr>
          </thead>
          <tbody>
            @for (client of clients(); track client.id) {
            <tr style="border-bottom: 1px solid #f1f5f9;">
              <td style="padding: 1rem; font-weight: 500;">{{client.nomLegal}}</td>
              <td style="padding: 1rem;">{{client.courriel}}</td>
              <td style="padding: 1rem;">{{client.telephone}}</td>
              <td style="padding: 1rem;">{{client._count?.projects}}</td>
            </tr>
            }
          </tbody>
        </table>
      </div>
    </div>
  `
})
export class ClientsComponent implements OnInit {
  ts = inject(TranslationService);
  private clientsGateway = inject(ClientsGateway);
  clients = signal<any[]>([]);

  async ngOnInit() {
    this.clients.set(await this.clientsGateway.getAll());
  }
}
