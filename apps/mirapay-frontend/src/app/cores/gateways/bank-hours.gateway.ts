import { Injectable } from '@angular/core';
import { BankHour } from '@mirapay/shared-models';

@Injectable({
  providedIn: 'root'
})
export class BankHoursGateway {
  private apiUrl = '/api/bank-hours';

  async create(data: Partial<BankHour>): Promise<BankHour> {
    const res = await fetch(this.apiUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    return res.json();
  }

  async getByClient(clientId: string): Promise<BankHour[]> {
    const res = await fetch(`${this.apiUrl}?clientId=${clientId}`);
    return res.json();
  }
}
