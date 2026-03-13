import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule],
  template: `
    <header class="app-header">
      <div class="header-left">
        <div class="logo">MiraPay</div>
      </div>
      <div class="header-right">
        <div class="notifications">
          <span class="icon">🔔</span>
        </div>
        <div class="user-profile">
          <span class="user-name">John Doe</span>
          <div class="avatar">JD</div>
        </div>
      </div>
    </header>
  `,
  styles: [`
    .app-header {
      height: 64px;
      background: #ffffff;
      border-bottom: 1px solid #e2e8f0;
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 0 2rem;
      box-shadow: 0 1px 2px 0 rgb(0 0 0 / 0.05);
      position: sticky;
      top: 0;
      z-index: 100;
    }
    .logo {
      font-size: 1.5rem;
      font-weight: 800;
      color: #6366f1;
      letter-spacing: -0.025em;
    }
    .header-right {
      display: flex;
      align-items: center;
      gap: 1.5rem;
    }
    .user-profile {
      display: flex;
      align-items: center;
      gap: 0.75rem;
    }
    .user-name {
      font-weight: 500;
      font-size: 0.875rem;
    }
    .avatar {
      width: 32px;
      height: 32px;
      background: #6366f1;
      color: white;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: 600;
      font-size: 0.75rem;
    }
    .notifications {
      cursor: pointer;
      font-size: 1.25rem;
      opacity: 0.6;
      transition: opacity 0.2s;
    }
    .notifications:hover {
      opacity: 1;
    }
  `]
})
export class HeaderComponent {}
