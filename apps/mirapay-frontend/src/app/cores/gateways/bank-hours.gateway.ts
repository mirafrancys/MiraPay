import { Injectable } from '@angular/core';
import { IBankHour } from '@mirapay/shared-models';

@Injectable({
  providedIn: 'root'
})
export class BankHoursGateway {
  private apiUrl = '/api/bank-hours';

  async create(data: Partial<IBankHour>): Promise<IBankHour> {
    const res = await fetch(this.apiUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    return res.json();
  }

  async getByClient(clientId: string): Promise<IBankHour[]> {
    const res = await fetch(`${this.apiUrl}?clientId=${clientId}`);
    return res.json();
  }
}
