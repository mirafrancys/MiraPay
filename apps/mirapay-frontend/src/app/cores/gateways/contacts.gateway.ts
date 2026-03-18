import { Injectable } from '@angular/core';

export interface ClientContact {
  id?: string;
  clientId: string;
  nom: string;
  fonction?: string;
  courriel?: string;
  telephone?: string;
}

@Injectable({
  providedIn: 'root'
})
export class ContactsGateway {
  private apiUrl = '/api/contacts';

  async getAllByClient(clientId: string): Promise<ClientContact[]> {
    const res = await fetch(`${this.apiUrl}/client/${clientId}`);
    return res.json();
  }

  async create(data: ClientContact): Promise<ClientContact> {
    const res = await fetch(this.apiUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    return res.json();
  }

  async delete(id: string): Promise<void> {
    await fetch(`${this.apiUrl}/${id}`, {
      method: 'DELETE'
    });
  }
}
