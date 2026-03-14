import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  template: `
    <div class="auth-container">
      <div class="auth-card">
        <div class="auth-header">
          <img src="/images/logo.png" alt="MiraPay Logo" class="auth-logo">
          <h2>Connexion</h2>
          <p>Bienvenue sur MiraPay. Veuillez vous connecter.</p>
        </div>

        <div class="auth-error" *ngIf="errorMessage">
          {{ errorMessage }}
        </div>

        <form (ngSubmit)="onSubmit()" #loginForm="ngForm" class="auth-form">
          <div class="form-group">
            <label for="identifier">Email ou Nom d'utilisateur</label>
            <input 
              type="text" 
              id="identifier" 
              name="identifier" 
              [(ngModel)]="credentials.emailOrUsername" 
              required
              class="form-control"
              placeholder="votre@email.com"
            />
          </div>

          <div class="form-group">
            <label for="password">Mot de passe</label>
            <input 
              type="password" 
              id="password" 
              name="password" 
              [(ngModel)]="credentials.password" 
              required
              class="form-control"
              placeholder="••••••••"
            />
          </div>

          <button type="submit" class="btn-primary" [disabled]="!loginForm.form.valid || isLoading">
            {{ isLoading ? 'Connexion en cours...' : 'Se connecter' }}
          </button>
        </form>

        <div class="auth-footer">
          <p>Pas encore de compte ? <a routerLink="/register">Inscrivez-vous ici</a>.</p>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .auth-container {
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      background: #f8fafc;
      padding: 2rem;
    }
    .auth-card {
      background: white;
      width: 100%;
      max-width: 420px;
      border-radius: 24px;
      padding: 2.5rem;
      box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.05), 0 10px 10px -5px rgba(0, 0, 0, 0.02);
    }
    .auth-header {
      text-align: center;
      margin-bottom: 2rem;
    }
    .auth-logo {
      height: 48px;
      margin-bottom: 1rem;
    }
    .auth-header h2 {
      font-size: 1.75rem;
      font-weight: 800;
      color: #0f172a;
      margin-bottom: 0.5rem;
    }
    .auth-header p {
      color: #64748b;
      font-size: 0.95rem;
    }
    .auth-error {
      background: #fef2f2;
      color: #ef4444;
      padding: 0.75rem;
      border-radius: 8px;
      font-size: 0.875rem;
      margin-bottom: 1.5rem;
      text-align: center;
      border: 1px solid #fecaca;
    }
    .auth-form {
      display: flex;
      flex-direction: column;
      gap: 1.25rem;
    }
    .form-group {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
    }
    .form-group label {
      font-size: 0.875rem;
      font-weight: 600;
      color: #334155;
    }
    .form-control {
      padding: 0.75rem 1rem;
      border: 1px solid #e2e8f0;
      border-radius: 12px;
      font-family: inherit;
      font-size: 1rem;
      outline: none;
      transition: all 0.2s;
    }
    .form-control:focus {
      border-color: #6366f1;
      box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.1);
    }
    .btn-primary {
      background: #6366f1;
      color: white;
      border: none;
      padding: 0.875rem;
      border-radius: 12px;
      font-weight: 700;
      font-size: 1rem;
      cursor: pointer;
      transition: all 0.2s;
      margin-top: 0.5rem;
    }
    .btn-primary:hover:not(:disabled) {
      background: #4f46e5;
      transform: translateY(-1px);
    }
    .btn-primary:disabled {
      opacity: 0.7;
      cursor: not-allowed;
    }
    .auth-footer {
      margin-top: 2rem;
      text-align: center;
      font-size: 0.9rem;
      color: #64748b;
    }
    .auth-footer a {
      color: #6366f1;
      font-weight: 600;
      text-decoration: none;
    }
    .auth-footer a:hover {
      text-decoration: underline;
    }
  `]
})
export class LoginComponent {
  credentials = { emailOrUsername: '', password: '' };
  isLoading = false;
  errorMessage = '';

  private authService = inject(AuthService);
  private router = inject(Router);

  async onSubmit() {
    this.isLoading = true;
    this.errorMessage = '';
    
    try {
      await this.authService.login(this.credentials);
      this.router.navigate(['/dashboard']);
    } catch (error: any) {
      this.errorMessage = error.message;
    } finally {
      this.isLoading = false;
    }
  }
}
