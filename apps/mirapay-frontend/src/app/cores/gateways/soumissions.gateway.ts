import { Injectable } from '@angular/core';
import { ISoumission } from '@mirapay/shared-models';

@Injectable({ providedIn: 'root' })
export class SoumissionsGateway {
  private apiUrl = '/api/soumissions';

  async getAll(): Promise<ISoumission[]> {
    const res = await fetch(this.apiUrl);
    return res.json();
  }

  async getOne(id: string): Promise<ISoumission> {
    const res = await fetch(`${this.apiUrl}/${id}`);
    return res.json();
  }

  async create(data: Partial<ISoumission>): Promise<ISoumission> {
    const res = await fetch(this.apiUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    return res.json();
  }

  async update(id: string, data: Partial<ISoumission>): Promise<ISoumission> {
    const res = await fetch(`${this.apiUrl}/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    return res.json();
  }
}
