import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { TranslationService } from '../../../cores/services/translation.service';
import { AuthGateway } from '../../../cores/gateways/auth.gateway';
import { ClientsGateway } from '../../../cores/gateways/clients.gateway';
import { ProjectsGateway } from '../../../cores/gateways/projects.gateway';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './sidebar.html',
  styleUrl: './sidebar.scss'
})
export class SidebarComponent {
  ts = inject(TranslationService);
  clientsGateway = inject(ClientsGateway);
  projectsGateway = inject(ProjectsGateway);
  private authService = inject(AuthGateway);
  private router = inject(Router);

  logout(event: Event) {
    event.preventDefault();
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
