import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [CommonModule],
  template: `
    <footer class="app-footer">
      <div class="footer-content">
        <p>&copy; 2026 MiraPay. Tous droits réservés.</p>
        <div class="footer-links">
          <a href="#">Aide</a>
          <a href="#">Confidentialité</a>
          <a href="#">Conditions</a>
        </div>
      </div>
    </footer>
  `,
  styles: [`
    .app-footer {
      background: #ffffff;
      border-top: 1px solid #e2e8f0;
      padding: 1.5rem 2rem;
      margin-top: auto;
    }
    .footer-content {
      display: flex;
      justify-content: space-between;
      align-items: center;
      max-width: 1200px;
      margin: 0 auto;
      font-size: 0.875rem;
      color: #64748b;
    }
    .footer-links {
      display: flex;
      gap: 1.5rem;
    }
    .footer-links a {
      color: #64748b;
      text-decoration: none;
      transition: color 0.2s;
    }
    .footer-links a:hover {
      color: #6366f1;
    }
  `]
})
export class FooterComponent {}
