import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { IClient } from '@mirapay/shared-models';

@Injectable({
  providedIn: 'root'
})
export class ClientsGateway {
  activeClient = signal<IClient | null>(null);
  private http = inject(HttpClient);
  private apiUrl = '/api/clients';

  getAll(): Observable<IClient[]> {
    return this.http.get<IClient[]>(this.apiUrl);
  }

  getOne(id: string): Observable<IClient> {
    return this.http.get<IClient>(`${this.apiUrl}/${id}`);
  }

  create(data: Partial<IClient>): Observable<IClient> {
    return this.http.post<IClient>(this.apiUrl, data);
  }

  update(id: string, data: Partial<IClient>): Observable<IClient> {
    return this.http.patch<IClient>(`${this.apiUrl}/${id}`, data);
  }

  archive(id: string): Observable<IClient> {
    return this.http.patch<IClient>(`${this.apiUrl}/${id}/archive`, {});
  }

  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
