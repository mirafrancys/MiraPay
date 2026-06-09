import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { IClientContact } from '@mirapay/shared-models';

@Injectable({
  providedIn: 'root'
})
export class ContactsGateway {
  private http = inject(HttpClient);
  private apiUrl = '/api/contacts';

  async getAllByClient(clientId: string): Promise<IClientContact[]> {
    return firstValueFrom(
      this.http.get<IClientContact[]>(`${this.apiUrl}/client/${clientId}`)
    );
  }

  async create(data: IClientContact): Promise<IClientContact> {
    return firstValueFrom(
      this.http.post<IClientContact>(this.apiUrl, data)
    );
  }

  async delete(id: string): Promise<void> {
    await firstValueFrom(
      this.http.delete<void>(`${this.apiUrl}/${id}`)
    );
  }
}
