import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ITimeEntry } from '@mirapay/shared-models';

@Injectable({
  providedIn: 'root'
})
export class TimeEntriesGateway {
  private http = inject(HttpClient);
  private apiUrl = '/api/time-entries';

  getAll(filters: {
    projetId?: string;
    userId?: string;
    statut?: string;
    estFacturable?: boolean;
    dateDebut?: string;
    dateFin?: string;
  } = {}): Observable<ITimeEntry[]> {
    let params = new HttpParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        params = params.set(key, value.toString());
      }
    });
    return this.http.get<ITimeEntry[]>(this.apiUrl, { params });
  }

  create(data: Partial<ITimeEntry>): Observable<ITimeEntry> {
    return this.http.post<ITimeEntry>(this.apiUrl, data);
  }

  update(id: string, data: Partial<ITimeEntry>): Observable<ITimeEntry> {
    return this.http.patch<ITimeEntry>(`${this.apiUrl}/${id}`, data);
  }

  approve(id: string): Observable<ITimeEntry> {
    return this.http.patch<ITimeEntry>(`${this.apiUrl}/${id}/approve`, {});
  }

  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
