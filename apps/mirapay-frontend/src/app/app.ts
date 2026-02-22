import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  standalone: true,
  imports: [CommonModule, RouterModule],
  selector: 'app-root',
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {
  title = 'MiraPay Dashboard';

  transactions = [
    {
      id: '1',
      amount: 150.0,
      currency: 'USD',
      status: 'COMPLETED',
      date: new Date(),
    },
    {
      id: '2',
      amount: 25.5,
      currency: 'EUR',
      status: 'PENDING',
      date: new Date(),
    },
    {
      id: '3',
      amount: 1200.0,
      currency: 'USD',
      status: 'COMPLETED',
      date: new Date(),
    },
  ];

  getStatusClass(status: string) {
    return {
      'status-completed': status === 'COMPLETED',
      'status-pending': status === 'PENDING',
      'status-failed': status === 'FAILED',
    };
  }
}
