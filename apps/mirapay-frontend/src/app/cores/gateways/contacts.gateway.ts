import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { IClientContact } from '@mirapay/shared-models';

@Injectable({
  providedIn: 'root'
})
export class ContactsGateway {
  private http = inject(HttpClient);
  private apiUrl = '/api/contacts';

  getAllByClient(clientId: string): Observable<IClientContact[]> {
    return this.http.get<IClientContact[]>(`${this.apiUrl}/client/${clientId}`);
  }

  create(data: IClientContact): Observable<IClientContact> {
    return this.http.post<IClientContact>(this.apiUrl, data);
  }

  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
