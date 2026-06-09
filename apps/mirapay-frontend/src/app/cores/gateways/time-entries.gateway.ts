import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { ITimeEntry } from '@mirapay/shared-models';

@Injectable({
  providedIn: 'root'
})
export class TimeEntriesGateway {
  private http = inject(HttpClient);
  private apiUrl = '/api/time-entries';

  async getAll(filters: {
    projetId?: string;
    userId?: string;
    statut?: string;
    estFacturable?: boolean;
    dateDebut?: string;
    dateFin?: string;
  } = {}): Promise<ITimeEntry[]> {
    let params = new HttpParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        params = params.set(key, value.toString());
      }
    });
    return firstValueFrom(this.http.get<ITimeEntry[]>(this.apiUrl, { params }));
  }

  async create(data: Partial<ITimeEntry>): Promise<ITimeEntry> {
    return firstValueFrom(this.http.post<ITimeEntry>(this.apiUrl, data));
  }

  async update(id: string, data: Partial<ITimeEntry>): Promise<ITimeEntry> {
    return firstValueFrom(this.http.patch<ITimeEntry>(`${this.apiUrl}/${id}`, data));
  }

  async approve(id: string): Promise<ITimeEntry> {
    return firstValueFrom(this.http.patch<ITimeEntry>(`${this.apiUrl}/${id}/approve`, {}));
  }

  async delete(id: string): Promise<void> {
    await firstValueFrom(this.http.delete<void>(`${this.apiUrl}/${id}`));
  }
}
