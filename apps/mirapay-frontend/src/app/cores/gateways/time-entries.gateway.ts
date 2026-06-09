import { Injectable } from '@angular/core';
import { ITimeEntry } from '@mirapay/shared-models';

@Injectable({
  providedIn: 'root'
})
export class TimeEntriesGateway {
  private apiUrl = '/api/time-entries';

  async getAll(filters: {
    projetId?: string;
    userId?: string;
    statut?: string;
    estFacturable?: boolean;
    dateDebut?: string;
    dateFin?: string;
  } = {}): Promise<ITimeEntry[]> {
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        params.append(key, value.toString());
      }
    });
    const res = await fetch(`${this.apiUrl}?${params.toString()}`);
    return res.json();
  }

  async create(data: Partial<ITimeEntry>): Promise<ITimeEntry> {
    const res = await fetch(this.apiUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    return res.json();
  }

  async update(id: string, data: Partial<ITimeEntry>): Promise<ITimeEntry> {
    const res = await fetch(`${this.apiUrl}/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    return res.json();
  }

  async approve(id: string): Promise<ITimeEntry> {
    const res = await fetch(`${this.apiUrl}/${id}/approve`, {
      method: 'PATCH'
    });
    return res.json();
  }

  async delete(id: string): Promise<void> {
    const res = await fetch(`${this.apiUrl}/${id}`, {
      method: 'DELETE'
    });
    return res.json();
  }
}
