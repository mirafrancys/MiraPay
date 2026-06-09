import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ISoumission } from '@mirapay/shared-models';

@Injectable({ providedIn: 'root' })
export class SoumissionsGateway {
  private http = inject(HttpClient);
  private apiUrl = '/api/soumissions';

  getAll(): Observable<ISoumission[]> {
    return this.http.get<ISoumission[]>(this.apiUrl);
  }

  getOne(id: string): Observable<ISoumission> {
    return this.http.get<ISoumission>(`${this.apiUrl}/${id}`);
  }

  create(data: Partial<ISoumission>): Observable<ISoumission> {
    return this.http.post<ISoumission>(this.apiUrl, data);
  }

  update(id: string, data: Partial<ISoumission>): Observable<ISoumission> {
    return this.http.put<ISoumission>(`${this.apiUrl}/${id}`, data);
  }
}
