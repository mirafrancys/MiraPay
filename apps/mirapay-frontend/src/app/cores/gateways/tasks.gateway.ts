import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ITask } from '@mirapay/shared-models';

@Injectable({
  providedIn: 'root'
})
export class TasksGateway {
  private http = inject(HttpClient);
  private apiUrl = '/api/tasks';

  getByProject(projectId: string): Observable<ITask[]> {
    return this.http.get<ITask[]>(`${this.apiUrl}/project/${projectId}`);
  }

  getOne(id: string): Observable<ITask> {
    return this.http.get<ITask>(`${this.apiUrl}/${id}`);
  }

  create(data: Partial<ITask>): Observable<ITask> {
    return this.http.post<ITask>(this.apiUrl, data);
  }

  update(id: string, data: Partial<ITask>): Observable<ITask> {
    return this.http.patch<ITask>(`${this.apiUrl}/${id}`, data);
  }

  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
