import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class InvoicesGateway {
  private apiUrl = '/api/invoices';

  async getAll(): Promise<any[]> {
    const res = await fetch(this.apiUrl);
    return res.json();
  }

  async getOne(id: string): Promise<any> {
    const res = await fetch(`${this.apiUrl}/${id}`);
    return res.json();
  }

  async prepareDraft(data: { clientId: string; projetId?: string; dateDebut?: string; dateFin?: string }): Promise<any> {
    const res = await fetch(`${this.apiUrl}/prepare-draft`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    return res.json();
  }

  async create(data: any): Promise<any> {
    const res = await fetch(this.apiUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    return res.json();
  }

  async updateStatus(id: string, statut: string): Promise<any> {
    const res = await fetch(`${this.apiUrl}/${id}/status`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ statut })
    });
    return res.json();
  }
}
