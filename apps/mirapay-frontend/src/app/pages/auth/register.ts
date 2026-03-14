import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthGateway } from '../../cores/gateways/auth.gateway';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './register.html',
  styleUrl: './register.scss'
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

  private authGateway = inject(AuthGateway);
  private router = inject(Router);

  async ngOnInit() {
    try {
      this.roles = await this.authGateway.getRoles();
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
      await this.authGateway.register(payload);
      this.successMessage = "Compte créé avec succès ! Vous pouvez maintenant vous connecter.";
    } catch (error: any) {
      this.errorMessage = error.message;
    } finally {
      this.isLoading = false;
    }
  }
}
