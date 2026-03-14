import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslationGateway } from '../../../cores/gateways/translation.gateway';
import { AuthGateway } from '../../../cores/gateways/auth.gateway';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './header.html',
  styleUrl: './header.scss'
})
export class HeaderComponent {
  ts = inject(TranslationGateway);
  auth = inject(AuthGateway);

  onLangChange(event: any) {
    this.ts.setLanguage(event.target.value);
  }
}
