import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { IBankHour } from '@mirapay/shared-models';

@Injectable({
  providedIn: 'root'
})
export class BankHoursGateway {
  private http = inject(HttpClient);
  private apiUrl = '/api/bank-hours';

  create(data: Partial<IBankHour>): Observable<IBankHour> {
    return this.http.post<IBankHour>(this.apiUrl, data);
  }

  getByClient(clientId: string): Observable<IBankHour[]> {
    return this.http.get<IBankHour[]>(this.apiUrl, { params: { clientId } });
  }
}
