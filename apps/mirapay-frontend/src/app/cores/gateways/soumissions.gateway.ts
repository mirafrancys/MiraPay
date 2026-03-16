import { Injectable } from '@angular/core';
import { Soumission } from '@mirapay/shared-models';

@Injectable({ providedIn: 'root' })
export class SoumissionsGateway {
  private apiUrl = '/api/soumissions';

  async getAll(): Promise<Soumission[]> {
    const res = await fetch(this.apiUrl);
    return res.json();
  }

  async getOne(id: string): Promise<Soumission> {
    const res = await fetch(`${this.apiUrl}/${id}`);
    return res.json();
  }

  async create(data: Partial<Soumission>): Promise<Soumission> {
    const res = await fetch(this.apiUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    return res.json();
  }

  async update(id: string, data: Partial<Soumission>): Promise<Soumission> {
    const res = await fetch(`${this.apiUrl}/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    return res.json();
  }
}
