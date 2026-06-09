import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { IProject } from '@mirapay/shared-models';

@Injectable({
  providedIn: 'root'
})
export class ProjectsGateway {
  activeProject = signal<IProject | null>(null);
  private http = inject(HttpClient);
  private apiUrl = '/api/projects';

  async getAll(): Promise<IProject[]> {
    return firstValueFrom(this.http.get<IProject[]>(this.apiUrl));
  }

  async getOne(id: string): Promise<IProject> {
    return firstValueFrom(this.http.get<IProject>(`${this.apiUrl}/${id}`));
  }

  async create(data: Partial<IProject>): Promise<IProject> {
    return firstValueFrom(this.http.post<IProject>(this.apiUrl, data));
  }

  async update(id: string, data: Partial<IProject>): Promise<IProject> {
    return firstValueFrom(this.http.patch<IProject>(`${this.apiUrl}/${id}`, data));
  }

  async delete(id: string): Promise<void> {
    await firstValueFrom(this.http.delete<void>(`${this.apiUrl}/${id}`));
  }
}
