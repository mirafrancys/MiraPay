import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslationService } from '../../../cores/services/translation.service';
import { AuthGateway } from '../../../cores/gateways/auth.gateway';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './header.html',
  styleUrl: './header.scss'
})
export class HeaderComponent {
  ts = inject(TranslationService);
  auth = inject(AuthGateway);

  onLangChange(event: any) {
    this.ts.setLanguage(event.target.value);
  }
}
