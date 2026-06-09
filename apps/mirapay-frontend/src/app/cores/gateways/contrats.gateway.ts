import { Injectable } from '@angular/core';
import { IContrat } from '@mirapay/shared-models';

@Injectable({ providedIn: 'root' })
export class ContratsGateway {
  private apiUrl = '/api/contrats';

  async getAll(): Promise<IContrat[]> {
    const res = await fetch(this.apiUrl);
    return res.json();
  }

  async getOne(id: string): Promise<IContrat> {
    const res = await fetch(`${this.apiUrl}/${id}`);
    return res.json();
  }

  async create(data: Partial<IContrat>): Promise<IContrat> {
    const res = await fetch(this.apiUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    return res.json();
  }

  async update(id: string, data: Partial<IContrat>): Promise<IContrat> {
    const res = await fetch(`${this.apiUrl}/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    return res.json();
  }
}
