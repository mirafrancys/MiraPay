import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="dashboard-page">
      <section class="overview">
        <div class="welcome-banner">
          <h1>Bienvenue, John 👋</h1>
          <p>Voici un aperçu de votre compte aujourd'hui.</p>
        </div>

        <div class="stats-grid">
          <div class="stat-card">
            <span class="label">Solde Total</span>
            <span class="value">$12,450.00</span>
            <span class="trend up">+2.5% cette semaine</span>
          </div>
          <div class="stat-card">
            <span class="label">Total Envoyé</span>
            <span class="value">$1,375.50</span>
          </div>
          <div class="stat-card">
            <span class="label">Transactions</span>
            <span class="value">24</span>
          </div>
        </div>
      </section>

      <section class="recent-transactions">
        <div class="section-header">
          <h2>Transactions Récentes</h2>
          <button class="btn-text">Voir tout</button>
        </div>

        <div class="table-container">
          <table class="transaction-table">
            <thead>
              <tr>
                <th>Destinataire</th>
                <th>Montant</th>
                <th>Statut</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              @for (tx of transactions; track tx.id) {
              <tr>
                <td>
                  <div class="user-row">
                    <div class="avatar-sm">{{tx.user[0]}}</div>
                    <span>{{tx.user}}</span>
                  </div>
                </td>
                <td [class.negative]="tx.amount < 0">
                  {{tx.amount | currency:'USD'}}
                </td>
                <td>
                  <span class="status-badge" [ngClass]="tx.status.toLowerCase()">
                    {{tx.status}}
                  </span>
                </td>
                <td>{{tx.date | date:'mediumDate'}}</td>
              </tr>
              }
            </tbody>
          </table>
        </div>
      </section>
    </div>
  `,
  styles: [`
    .dashboard-page {
      padding: 2rem;
      max-width: 1200px;
      margin: 0 auto;
    }
    .welcome-banner {
      margin-bottom: 2rem;
    }
    h1 {
      font-size: 2rem;
      font-weight: 800;
      color: #1e293b;
      margin-bottom: 0.5rem;
    }
    .welcome-banner p {
      color: #64748b;
    }
    .stats-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
      gap: 1.5rem;
      margin-bottom: 3rem;
    }
    .stat-card {
      background: white;
      padding: 1.5rem;
      border-radius: 16px;
      border: 1px solid #e2e8f0;
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
      box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.05);
    }
    .stat-card .label {
      font-size: 0.875rem;
      color: #64748b;
      font-weight: 500;
    }
    .stat-card .value {
      font-size: 1.875rem;
      font-weight: 800;
      color: #1e293b;
    }
    .trend {
      font-size: 0.75rem;
      font-weight: 600;
    }
    .trend.up { color: #10b981; }

    .section-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 1.5rem;
    }
    .btn-text {
      background: none;
      border: none;
      color: #6366f1;
      font-weight: 600;
      cursor: pointer;
    }

    .table-container {
      background: white;
      border-radius: 16px;
      border: 1px solid #e2e8f0;
      overflow: hidden;
      box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.05);
    }
    .transaction-table {
      width: 100%;
      border-collapse: collapse;
    }
    th {
      text-align: left;
      padding: 1rem 1.5rem;
      background: #f8fafc;
      color: #64748b;
      font-size: 0.75rem;
      text-transform: uppercase;
      font-weight: 600;
      border-bottom: 1px solid #e2e8f0;
    }
    td {
      padding: 1rem 1.5rem;
      border-bottom: 1px solid #f1f5f9;
      font-size: 0.875rem;
    }
    .user-row {
      display: flex;
      align-items: center;
      gap: 0.75rem;
    }
    .avatar-sm {
      width: 28px;
      height: 28px;
      background: #f1f5f9;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 0.75rem;
      font-weight: 600;
      color: #64748b;
    }
    .status-badge {
      padding: 0.25rem 0.75rem;
      border-radius: 9999px;
      font-size: 0.75rem;
      font-weight: 600;
    }
    .completed { background: #dcfce7; color: #15803d; }
    .pending { background: #fef9c3; color: #a16207; }
  `]
})
export class DashboardComponent {
  transactions = [
    { id: '1', user: 'Amazon.com', amount: -150.0, status: 'Completed', date: new Date() },
    { id: '2', user: 'Transfert de Marie', amount: 500.0, status: 'Completed', date: new Date() },
    { id: '3', user: 'Netflix', amount: -15.99, status: 'Pending', date: new Date() },
    { id: '4', user: 'Apple Store', amount: -1200.0, status: 'Completed', date: new Date() },
  ];
}
