import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthGateway } from '../../cores/gateways/auth.gateway';
import { TranslationService } from '../../cores/services/translation.service';
import { User } from '@mirapay/shared-models';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './register.html',
  styleUrl: './register.scss'
})
export class RegisterComponent implements OnInit {
  ts = inject(TranslationService);
  user: Partial<User> = {
    firstName: '',
    lastName: '',
    username: '',
    email: '',
    password: '',
    phoneNumber: '',
    address: '',
    city: '',
    country: ''
  };
  
  isLoading = false;
  errorMessage = '';
  successMessage = '';

  private authGateway = inject(AuthGateway);
  private router = inject(Router);

  async onSubmit() {
    this.isLoading = true;
    this.errorMessage = '';
    
    const payload = { ...this.user };

    try {
      await this.authGateway.register(payload);
      this.successMessage = "Compte créé avec succès ! Vous pouvez maintenant vous connecter.";
    } catch (error) {
      if (error instanceof Error) {
        this.errorMessage = error.message;
      } else {
        this.errorMessage = 'An error occurred';
      }
    } finally {
      this.isLoading = false;
    }
  }
}
