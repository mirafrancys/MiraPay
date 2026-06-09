import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { IClient } from '@mirapay/shared-models';

@Injectable({
  providedIn: 'root'
})
export class ClientsGateway {
  activeClient = signal<IClient | null>(null);
  private http = inject(HttpClient);
  private apiUrl = '/api/clients';

  async getAll(): Promise<IClient[]> {
    return firstValueFrom(this.http.get<IClient[]>(this.apiUrl));
  }

  async getOne(id: string): Promise<IClient> {
    return firstValueFrom(this.http.get<IClient>(`${this.apiUrl}/${id}`));
  }

  async create(data: Partial<IClient>): Promise<IClient> {
    return firstValueFrom(this.http.post<IClient>(this.apiUrl, data));
  }

  async update(id: string, data: Partial<IClient>): Promise<IClient> {
    return firstValueFrom(this.http.patch<IClient>(`${this.apiUrl}/${id}`, data));
  }

  async archive(id: string): Promise<IClient> {
    return firstValueFrom(this.http.patch<IClient>(`${this.apiUrl}/${id}/archive`, {}));
  }

  async delete(id: string): Promise<void> {
    await firstValueFrom(this.http.delete<void>(`${this.apiUrl}/${id}`));
  }
}
