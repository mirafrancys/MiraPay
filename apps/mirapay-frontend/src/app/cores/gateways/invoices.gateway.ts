import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { IInvoice } from '@mirapay/shared-models';

@Injectable({
  providedIn: 'root'
})
export class InvoicesGateway {
  private http = inject(HttpClient);
  private apiUrl = '/api/invoices';

  getAll(): Observable<IInvoice[]> {
    return this.http.get<IInvoice[]>(this.apiUrl);
  }

  getOne(id: string): Observable<IInvoice> {
    return this.http.get<IInvoice>(`${this.apiUrl}/${id}`);
  }

  prepareDraft(data: { clientId: string; projetId?: string; dateDebut?: string; dateFin?: string }): Observable<IInvoice> {
    return this.http.post<IInvoice>(`${this.apiUrl}/prepare-draft`, data);
  }

  create(data: Partial<IInvoice>): Observable<IInvoice> {
    return this.http.post<IInvoice>(this.apiUrl, data);
  }

  updateStatus(id: string, statut: string): Observable<IInvoice> {
    return this.http.patch<IInvoice>(`${this.apiUrl}/${id}/status`, { statut });
  }
}
