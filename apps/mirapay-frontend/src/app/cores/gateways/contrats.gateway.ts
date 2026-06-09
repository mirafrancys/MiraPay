import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { IContrat } from '@mirapay/shared-models';

@Injectable({ providedIn: 'root' })
export class ContratsGateway {
  private http = inject(HttpClient);
  private apiUrl = '/api/contrats';

  async getAll(): Promise<IContrat[]> {
    return firstValueFrom(this.http.get<IContrat[]>(this.apiUrl));
  }

  async getOne(id: string): Promise<IContrat> {
    return firstValueFrom(this.http.get<IContrat>(`${this.apiUrl}/${id}`));
  }

  async create(data: Partial<IContrat>): Promise<IContrat> {
    return firstValueFrom(this.http.post<IContrat>(this.apiUrl, data));
  }

  async update(id: string, data: Partial<IContrat>): Promise<IContrat> {
    return firstValueFrom(this.http.put<IContrat>(`${this.apiUrl}/${id}`, data));
  }
}
