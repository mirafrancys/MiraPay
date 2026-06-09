import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { IProject } from '@mirapay/shared-models';

@Injectable({
  providedIn: 'root'
})
export class ProjectsGateway {
  activeProject = signal<IProject | null>(null);
  private http = inject(HttpClient);
  private apiUrl = '/api/projects';

  getAll(): Observable<IProject[]> {
    return this.http.get<IProject[]>(this.apiUrl);
  }

  getOne(id: string): Observable<IProject> {
    return this.http.get<IProject>(`${this.apiUrl}/${id}`);
  }

  create(data: Partial<IProject>): Observable<IProject> {
    return this.http.post<IProject>(this.apiUrl, data);
  }

  update(id: string, data: Partial<IProject>): Observable<IProject> {
    return this.http.patch<IProject>(`${this.apiUrl}/${id}`, data);
  }

  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
