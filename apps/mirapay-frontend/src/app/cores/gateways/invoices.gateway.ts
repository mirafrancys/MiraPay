import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { IInvoice } from '@mirapay/shared-models';

@Injectable({
  providedIn: 'root'
})
export class InvoicesGateway {
  private http = inject(HttpClient);
  private apiUrl = '/api/invoices';

  async getAll(): Promise<IInvoice[]> {
    return firstValueFrom(this.http.get<IInvoice[]>(this.apiUrl));
  }

  async getOne(id: string): Promise<IInvoice> {
    return firstValueFrom(this.http.get<IInvoice>(`${this.apiUrl}/${id}`));
  }

  async prepareDraft(data: { clientId: string; projetId?: string; dateDebut?: string; dateFin?: string }): Promise<IInvoice> {
    return firstValueFrom(this.http.post<IInvoice>(`${this.apiUrl}/prepare-draft`, data));
  }

  async create(data: Partial<IInvoice>): Promise<IInvoice> {
    return firstValueFrom(this.http.post<IInvoice>(this.apiUrl, data));
  }

  async updateStatus(id: string, statut: string): Promise<IInvoice> {
    return firstValueFrom(this.http.patch<IInvoice>(`${this.apiUrl}/${id}/status`, { statut }));
  }
}
