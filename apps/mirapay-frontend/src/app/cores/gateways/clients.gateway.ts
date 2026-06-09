import { Injectable, signal } from '@angular/core';
import { IClient } from '@mirapay/shared-models';

@Injectable({
  providedIn: 'root'
})
export class ClientsGateway {
  activeClient = signal<IClient | null>(null);
  
  private apiUrl = '/api/clients';

  async getAll(): Promise<IClient[]> {
    const res = await fetch(this.apiUrl);
    return res.json();
  }

  async getOne(id: string): Promise<IClient> {
    const res = await fetch(`${this.apiUrl}/${id}`);
    return res.json();
  }

  async create(data: Partial<IClient>): Promise<IClient> {
    const res = await fetch(this.apiUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    return res.json();
  }

  async update(id: string, data: Partial<IClient>): Promise<IClient> {
    const res = await fetch(`${this.apiUrl}/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    return res.json();
  }

  async archive(id: string): Promise<IClient> {
    const res = await fetch(`${this.apiUrl}/${id}/archive`, {
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
