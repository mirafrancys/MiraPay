import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthGateway } from '../../cores/gateways/auth.gateway';
import { TranslationService } from '../../cores/services/translation.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './login.html',
  styleUrl: './login.scss'
})
export class LoginComponent {
  ts = inject(TranslationService);
  credentials = { emailOrUsername: '', password: '' };
  isLoading = false;
  errorMessage = '';

  private authGateway = inject(AuthGateway);
  private router = inject(Router);

  async onSubmit() {
    this.isLoading = true;
    this.errorMessage = '';
    
    try {
      await this.authGateway.login(this.credentials);
      this.router.navigate(['/dashboard']);
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
