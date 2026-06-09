import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { IBankHour } from '@mirapay/shared-models';

@Injectable({
  providedIn: 'root'
})
export class BankHoursGateway {
  private http = inject(HttpClient);
  private apiUrl = '/api/bank-hours';

  async create(data: Partial<IBankHour>): Promise<IBankHour> {
    return firstValueFrom(
      this.http.post<IBankHour>(this.apiUrl, data)
    );
  }

  async getByClient(clientId: string): Promise<IBankHour[]> {
    return firstValueFrom(
      this.http.get<IBankHour[]>(this.apiUrl, { params: { clientId } })
    );
  }
}
