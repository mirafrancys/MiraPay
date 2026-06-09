import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { IContrat } from '@mirapay/shared-models';

@Injectable({ providedIn: 'root' })
export class ContratsGateway {
  private http = inject(HttpClient);
  private apiUrl = '/api/contrats';

  getAll(): Observable<IContrat[]> {
    return this.http.get<IContrat[]>(this.apiUrl);
  }

  getOne(id: string): Observable<IContrat> {
    return this.http.get<IContrat>(`${this.apiUrl}/${id}`);
  }

  create(data: Partial<IContrat>): Observable<IContrat> {
    return this.http.post<IContrat>(this.apiUrl, data);
  }

  update(id: string, data: Partial<IContrat>): Observable<IContrat> {
    return this.http.put<IContrat>(`${this.apiUrl}/${id}`, data);
  }
}
