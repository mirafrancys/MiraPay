import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { TranslationService } from '../../services/translation.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <aside class="app-sidebar">
      <nav class="sidebar-nav">
        <ul>
          <li>
            <a routerLink="/dashboard" routerLinkActive="active">
              <span class="icon">📊</span>
              <span class="label">{{ts.translate('COMMON.DASHBOARD')}}</span>
            </a>
          </li>
          <li>
            <a routerLink="/transactions" routerLinkActive="active">
              <span class="icon">💸</span>
              <span class="label">{{ts.translate('COMMON.TRANSACTIONS')}}</span>
            </a>
          </li>
          <li>
            <a routerLink="/cards" routerLinkActive="active">
              <span class="icon">💳</span>
              <span class="label">{{ts.translate('COMMON.CARDS')}}</span>
            </a>
          </li>
          <li>
            <a routerLink="/contacts" routerLinkActive="active">
              <span class="icon">👥</span>
              <span class="label">{{ts.translate('COMMON.CONTACTS')}}</span>
            </a>
          </li>
        </ul>

        <div class="sidebar-footer">
          <a routerLink="/settings" routerLinkActive="active">
            <span class="icon">⚙️</span>
            <span class="label">{{ts.translate('COMMON.SETTINGS')}}</span>
          </a>
          <a href="#" class="logout" (click)="logout($event)">
            <span class="icon">🚪</span>
            <span class="label">{{ts.translate('COMMON.LOGOUT')}}</span>
          </a>
        </div>
      </nav>
    </aside>
  `,
  styles: [`
    .app-sidebar {
      width: 260px;
      background: #ffffff;
      border-right: 1px solid #e2e8f0;
      height: calc(100vh - 64px);
      position: sticky;
      top: 64px;
      padding: 1.5rem 0;
    }
    .sidebar-nav {
      display: flex;
      flex-direction: column;
      height: 100%;
      justify-content: space-between;
    }
    ul {
      list-style: none;
      padding: 0;
      margin: 0;
    }
    li {
      margin-bottom: 0.5rem;
      padding: 0 1rem;
    }
    a {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      padding: 0.75rem 1rem;
      color: #64748b;
      text-decoration: none;
      border-radius: 8px;
      font-weight: 500;
      transition: all 0.2s;
    }
    a:hover {
      background: #f1f5f9;
      color: #1e293b;
    }
    a.active {
      background: #eef2ff;
      color: #6366f1;
    }
    .icon {
      font-size: 1.25rem;
    }
    .sidebar-footer {
      padding: 1rem;
      border-top: 1px solid #f1f5f9;
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
    }
    .logout {
      color: #ef4444;
    }
    .logout:hover {
      background: #fef2f2;
      color: #dc2626;
    }
  `]
})
export class SidebarComponent {
  ts = inject(TranslationService);
  private authService = inject(AuthService);
  private router = inject(Router);

  logout(event: Event) {
    event.preventDefault();
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
