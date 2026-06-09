import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { ITask } from '@mirapay/shared-models';

@Injectable({
  providedIn: 'root'
})
export class TasksGateway {
  private http = inject(HttpClient);
  private apiUrl = '/api/tasks';

  async getByProject(projectId: string): Promise<ITask[]> {
    return firstValueFrom(this.http.get<ITask[]>(`${this.apiUrl}/project/${projectId}`));
  }

  async getOne(id: string): Promise<ITask> {
    return firstValueFrom(this.http.get<ITask>(`${this.apiUrl}/${id}`));
  }

  async create(data: Partial<ITask>): Promise<ITask> {
    return firstValueFrom(this.http.post<ITask>(this.apiUrl, data));
  }

  async update(id: string, data: Partial<ITask>): Promise<ITask> {
    return firstValueFrom(this.http.patch<ITask>(`${this.apiUrl}/${id}`, data));
  }

  async delete(id: string): Promise<void> {
    await firstValueFrom(this.http.delete<void>(`${this.apiUrl}/${id}`));
  }
}
