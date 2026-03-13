import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslationService } from '../../services/translation.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="dashboard-page">
      <section class="overview">
        <div class="welcome-header">
          <div class="welcome-text">
            <h1>{{ts.translate('DASHBOARD.GREETING')}}</h1>
            <p>{{ts.translate('DASHBOARD.SUBTITLE')}}</p>
          </div>
          <div class="quick-actions">
            <button class="btn-primary">
              <span class="icon">➕</span>
              Nouveau Transfert
            </button>
          </div>
        </div>

        <div class="dashboard-hero">
          <div class="hero-card">
            <div class="card-content">
              <span class="card-label">Solde Disponible</span>
              <h2 class="card-value">$12,450.00</h2>
              <div class="card-meta">
                <span class="card-number">**** **** **** 4582</span>
                <span class="card-expiry">12/28</span>
              </div>
            </div>
            <img src="/images/card.png" alt="Card Background" class="card-bg-img">
          </div>

          <div class="stats-mini">
            <div class="mini-card income">
              <div class="mini-icon">📈</div>
              <div class="mini-data">
                <span class="mini-label">Revenus</span>
                <span class="mini-value">+$2,400.00</span>
              </div>
            </div>
            <div class="mini-card expense">
              <div class="mini-icon">📉</div>
              <div class="mini-data">
                <span class="mini-label">Dépenses</span>
                <span class="mini-value">-$1,150.00</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section class="recent-transactions">
        <div class="section-header">
          <h2>{{ts.translate('DASHBOARD.RECENT_TRANSACTIONS')}}</h2>
          <button class="btn-text">{{ts.translate('DASHBOARD.SEE_ALL')}}</button>
        </div>

        <div class="table-container">
          <table class="transaction-table">
            <thead>
              <tr>
                <th>{{ts.translate('DASHBOARD.RECIPIENT')}}</th>
                <th>{{ts.translate('DASHBOARD.AMOUNT')}}</th>
                <th>{{ts.translate('DASHBOARD.STATUS')}}</th>
                <th>{{ts.translate('DASHBOARD.DATE')}}</th>
              </tr>
            </thead>
            <tbody>
              @for (tx of transactions; track tx.id) {
              <tr>
                <td>
                  <div class="user-row">
                    <div class="avatar-sm">{{tx.user[0]}}</div>
                    <div class="user-info">
                      <span class="user-name">{{tx.user}}</span>
                      <span class="user-category">Shopping</span>
                    </div>
                  </div>
                </td>
                <td [class.negative]="tx.amount < 0" class="amount-cell">
                  {{tx.amount > 0 ? '+' : ''}}{{tx.amount | currency:'USD'}}
                </td>
                <td>
                  <span class="status-badge" [ngClass]="tx.status.toLowerCase()">
                    {{tx.status}}
                  </span>
                </td>
                <td class="date-cell">{{tx.date | date:'mediumDate'}}</td>
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
      padding: 2.5rem;
      max-width: 1400px;
      margin: 0 auto;
      background: #f8fafc;
    }

    /* Welcome Header */
    .welcome-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 2.5rem;
    }

    .welcome-text h1 {
      font-size: 2.25rem;
      font-weight: 800;
      color: #0f172a;
      letter-spacing: -0.025em;
      margin-bottom: 0.5rem;
    }

    .welcome-text p {
      color: #64748b;
      font-size: 1.1rem;
    }

    .btn-primary {
      background: #6366f1;
      color: white;
      border: none;
      padding: 0.8rem 1.5rem;
      border-radius: 12px;
      font-weight: 600;
      display: flex;
      align-items: center;
      gap: 0.75rem;
      cursor: pointer;
      transition: all 0.2s;
      box-shadow: 0 4px 12px rgba(99, 102, 241, 0.3);
    }

    .btn-primary:hover {
      background: #4f46e5;
      transform: translateY(-2px);
    }

    /* Hero Section with Card */
    .dashboard-hero {
      display: grid;
      grid-template-columns: 2fr 1fr;
      gap: 2rem;
      margin-bottom: 3.5rem;
    }

    .hero-card {
      position: relative;
      height: 240px;
      background: linear-gradient(135deg, #1e1b4b 0%, #312e81 100%);
      border-radius: 24px;
      overflow: hidden;
      padding: 2rem;
      color: white;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
    }

    .card-bg-img {
      position: absolute;
      top: 0;
      right: 0;
      width: 100%;
      height: 100%;
      object-fit: cover;
      opacity: 0.4;
      pointer-events: none;
    }

    .card-content {
      position: relative;
      z-index: 1;
    }

    .card-label {
      font-size: 0.9rem;
      opacity: 0.8;
      font-weight: 500;
      text-transform: uppercase;
      letter-spacing: 0.05em;
    }

    .card-value {
      font-size: 2.5rem;
      font-weight: 800;
      margin: 0.5rem 0;
    }

    .card-meta {
      display: flex;
      justify-content: space-between;
      font-family: 'Courier New', Courier, monospace;
      font-size: 1.1rem;
      letter-spacing: 0.1em;
      opacity: 0.9;
    }

    /* Stats Mini */
    .stats-mini {
      display: flex;
      flex-direction: column;
      gap: 1.5rem;
    }

    .mini-card {
      background: white;
      padding: 1.25rem;
      border-radius: 20px;
      border: 1px solid #e2e8f0;
      display: flex;
      align-items: center;
      gap: 1.25rem;
      transition: all 0.2s;
    }

    .mini-card:hover {
      border-color: #cbd5e1;
      transform: translateX(5px);
    }

    .mini-icon {
      width: 48px;
      height: 48px;
      background: #f1f5f9;
      border-radius: 14px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 1.5rem;
    }

    .mini-data {
      display: flex;
      flex-direction: column;
    }

    .mini-label {
      font-size: 0.85rem;
      color: #64748b;
      font-weight: 500;
    }

    .mini-value {
      font-size: 1.15rem;
      font-weight: 700;
      color: #0f172a;
    }

    .income .mini-value { color: #10b981; }
    .expense .mini-value { color: #ef4444; }

    /* Transactions Table */
    .section-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 2rem;
    }

    .section-header h2 {
      font-size: 1.5rem;
      font-weight: 700;
      color: #0f172a;
    }

    .btn-text {
      background: transparent;
      border: none;
      color: #6366f1;
      font-weight: 600;
      font-size: 0.95rem;
      cursor: pointer;
      text-decoration: underline;
    }

    .table-container {
      background: white;
      border-radius: 24px;
      border: 1px solid #e2e8f0;
      overflow: hidden;
      box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);
    }

    .transaction-table {
      width: 100%;
      border-collapse: collapse;
    }

    th {
      text-align: left;
      padding: 1.25rem 2rem;
      background: #f8fafc;
      color: #64748b;
      font-size: 0.8rem;
      text-transform: uppercase;
      font-weight: 700;
      letter-spacing: 0.05em;
    }

    td {
      padding: 1.25rem 2rem;
      border-bottom: 1px solid #f1f5f9;
      vertical-align: middle;
    }

    .user-row {
      display: flex;
      align-items: center;
      gap: 1rem;
    }

    .avatar-sm {
      width: 40px;
      height: 40px;
      background: #eef2ff;
      color: #6366f1;
      border-radius: 12px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: 700;
      font-size: 1rem;
    }

    .user-info {
      display: flex;
      flex-direction: column;
    }

    .user-name {
      font-weight: 600;
      color: #1e293b;
      font-size: 1rem;
    }

    .user-category {
      font-size: 0.8rem;
      color: #94a3b8;
    }

    .amount-cell {
      font-weight: 700;
      font-size: 1rem;
      color: #059669;
    }

    .negative {
      color: #0f172a;
    }

    .status-badge {
      padding: 0.4rem 0.8rem;
      border-radius: 10px;
      font-size: 0.75rem;
      font-weight: 700;
      text-transform: uppercase;
    }

    .completed { background: #d1fae5; color: #065f46; }
    .pending { background: #fef3c7; color: #92400e; }

    .date-cell {
      color: #64748b;
      font-size: 0.9rem;
    }

    @media (max-width: 1024px) {
      .dashboard-hero {
        grid-template-columns: 1fr;
      }
    }
  `]
})
export class DashboardComponent {
  ts = inject(TranslationService);

  transactions = [
    { id: '1', user: 'Amazon Express', amount: -150.0, status: 'Completed', date: new Date() },
    { id: '2', user: 'Marie Lefebvre', amount: 500.0, status: 'Completed', date: new Date() },
    { id: '3', user: 'Netflix Premium', amount: -15.99, status: 'Pending', date: new Date() },
    { id: '4', user: 'Apple Store', amount: -1200.0, status: 'Completed', date: new Date() },
  ];
}
