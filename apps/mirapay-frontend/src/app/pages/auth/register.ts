import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  template: `
    <div class="auth-container">
      <div class="auth-card">
        <div class="auth-header">
          <img src="/images/logo.png" alt="MiraPay Logo" class="auth-logo">
          <h2>Créer un compte</h2>
          <p>Rejoignez MiraPay en quelques secondes.</p>
        </div>

        <div class="auth-error" *ngIf="errorMessage">
          {{ errorMessage }}
        </div>
        <div class="auth-success" *ngIf="successMessage">
          {{ successMessage }}
        </div>

        <form (ngSubmit)="onSubmit()" #registerForm="ngForm" class="auth-form" *ngIf="!successMessage">
          
          <div class="form-row">
            <div class="form-group flex-1">
              <label for="firstName">Prénom</label>
              <input type="text" id="firstName" name="firstName" [(ngModel)]="user.firstName" required class="form-control" />
            </div>
            <div class="form-group flex-1">
              <label for="lastName">Nom</label>
              <input type="text" id="lastName" name="lastName" [(ngModel)]="user.lastName" required class="form-control" />
            </div>
          </div>

          <div class="form-row">
            <div class="form-group flex-1">
              <label for="username">Nom d'utilisateur</label>
              <input type="text" id="username" name="username" [(ngModel)]="user.username" required class="form-control" />
            </div>
            <div class="form-group flex-1">
              <label for="email">Email</label>
              <input type="email" id="email" name="email" [(ngModel)]="user.email" required class="form-control" />
            </div>
          </div>

          <div class="form-group">
            <label for="password">Mot de passe</label>
            <input type="password" id="password" name="password" [(ngModel)]="user.password" required class="form-control" />
          </div>

          <div class="form-row">
            <div class="form-group flex-1">
              <label for="phoneNumber">Téléphone</label>
              <input type="text" id="phoneNumber" name="phoneNumber" [(ngModel)]="user.phoneNumber" class="form-control" />
            </div>
            <div class="form-group flex-1">
              <label for="roleId">Rôle</label>
              <select id="roleId" name="roleId" [(ngModel)]="user.roleId" class="form-control">
                <option value="">Sélectionnez un rôle</option>
                <option *ngFor="let role of roles" [value]="role.id">{{ role.name }}</option>
              </select>
            </div>
          </div>

          <div class="form-group">
            <label for="address">Adresse</label>
            <input type="text" id="address" name="address" [(ngModel)]="user.address" class="form-control" />
          </div>

          <div class="form-row">
            <div class="form-group flex-1">
              <label for="city">Ville</label>
              <input type="text" id="city" name="city" [(ngModel)]="user.city" class="form-control" />
            </div>
            <div class="form-group flex-1">
              <label for="country">Pays</label>
              <input type="text" id="country" name="country" [(ngModel)]="user.country" class="form-control" />
            </div>
          </div>

          <button type="submit" class="btn-primary" [disabled]="!registerForm.form.valid || isLoading">
            {{ isLoading ? 'Création en cours...' : 'S\\'inscrire' }}
          </button>
        </form>

        <div class="auth-footer" *ngIf="!successMessage">
          <p>Déjà un compte ? <a routerLink="/login">Connectez-vous ici</a>.</p>
        </div>
        <div class="auth-footer" *ngIf="successMessage">
          <p><a routerLink="/login" class="btn-secondary">Aller à la page de connexion</a></p>
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
      max-width: 600px;
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
    .auth-success {
      background: #dcfce7;
      color: #15803d;
      padding: 1rem;
      border-radius: 8px;
      font-size: 1rem;
      margin-bottom: 1.5rem;
      text-align: center;
      border: 1px solid #bbf7d0;
      font-weight: 600;
    }
    .auth-form {
      display: flex;
      flex-direction: column;
      gap: 1.25rem;
    }
    .form-row {
      display: flex;
      gap: 1rem;
    }
    .flex-1 {
      flex: 1;
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
      background: #fff;
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
      margin-top: 1rem;
    }
    .btn-primary:hover:not(:disabled) {
      background: #4f46e5;
      transform: translateY(-1px);
    }
    .btn-primary:disabled {
      opacity: 0.7;
      cursor: not-allowed;
    }
    .btn-secondary {
      display: inline-block;
      background: #eef2ff;
      color: #6366f1;
      padding: 0.75rem 1.5rem;
      border-radius: 8px;
      text-decoration: none;
      font-weight: 600;
    }
    .btn-secondary:hover {
      background: #e0e7ff;
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
    @media (max-width: 640px) {
      .form-row {
        flex-direction: column;
      }
    }
  `]
})
export class RegisterComponent implements OnInit {
  user: any = {
    firstName: '',
    lastName: '',
    username: '',
    email: '',
    password: '',
    phoneNumber: '',
    address: '',
    city: '',
    country: '',
    roleId: ''
  };
  roles: any[] = [];
  
  isLoading = false;
  errorMessage = '';
  successMessage = '';

  private authService = inject(AuthService);
  private router = inject(Router);

  async ngOnInit() {
    try {
      this.roles = await this.authService.getRoles();
    } catch (e) {
      console.error('Erreur chargement roles', e);
    }
  }

  async onSubmit() {
    this.isLoading = true;
    this.errorMessage = '';
    
    // Formatting data before sending
    const payload = { ...this.user };
    if (!payload.roleId) {
      delete payload.roleId;
    }

    try {
      await this.authService.register(payload);
      this.successMessage = "Compte créé avec succès ! Vous pouvez maintenant vous connecter.";
    } catch (error: any) {
      this.errorMessage = error.message;
    } finally {
      this.isLoading = false;
    }
  }
}
