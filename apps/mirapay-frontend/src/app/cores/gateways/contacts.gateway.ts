import { Injectable } from '@angular/core';
import { IClientContact } from '@mirapay/shared-models';

@Injectable({
  providedIn: 'root'
})
export class ContactsGateway {
  private apiUrl = '/api/contacts';

  async getAllByClient(clientId: string): Promise<IClientContact[]> {
    const res = await fetch(`${this.apiUrl}/client/${clientId}`);
    return res.json();
  }

  async create(data: IClientContact): Promise<IClientContact> {
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
