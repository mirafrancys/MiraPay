import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { ISoumission } from '@mirapay/shared-models';

@Injectable({ providedIn: 'root' })
export class SoumissionsGateway {
  private http = inject(HttpClient);
  private apiUrl = '/api/soumissions';

  async getAll(): Promise<ISoumission[]> {
    return firstValueFrom(this.http.get<ISoumission[]>(this.apiUrl));
  }

  async getOne(id: string): Promise<ISoumission> {
    return firstValueFrom(this.http.get<ISoumission>(`${this.apiUrl}/${id}`));
  }

  async create(data: Partial<ISoumission>): Promise<ISoumission> {
    return firstValueFrom(this.http.post<ISoumission>(this.apiUrl, data));
  }

  async update(id: string, data: Partial<ISoumission>): Promise<ISoumission> {
    return firstValueFrom(this.http.put<ISoumission>(`${this.apiUrl}/${id}`, data));
  }
}
