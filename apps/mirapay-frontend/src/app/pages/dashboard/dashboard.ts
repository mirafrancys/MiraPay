import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslationService } from '../../cores/services/translation.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss'
})
export class DashboardComponent {
  ts = inject(TranslationService);

  transactions = [
    { id: '1', user: 'Amazon Express', amount: -150.0, status: 'Completed', date: new Date() },
    { id: '2', user: 'Marie Lefebvre', amount: 500.0, status: 'Completed', date: new Date() },
    { id: '3', user: 'Netflix Premium', amount: -15.99, status: 'Pending', date: new Date() },
    { id: '4', user: 'Apple Store', amount: -1200.0, status: 'Completed', date: new Date() },
  ];
}
