import { Injectable, signal } from '@angular/core';
import { IProject } from '@mirapay/shared-models';

@Injectable({
  providedIn: 'root'
})
export class ProjectsGateway {
  activeProject = signal<IProject | null>(null);
  
  private apiUrl = '/api/projects';

  async getAll(): Promise<IProject[]> {
    const res = await fetch(this.apiUrl);
    return res.json();
  }

  async getOne(id: string): Promise<IProject> {
    const res = await fetch(`${this.apiUrl}/${id}`);
    return res.json();
  }

  async create(data: Partial<IProject>): Promise<IProject> {
    const res = await fetch(this.apiUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    return res.json();
  }

  async update(id: string, data: Partial<IProject>): Promise<IProject> {
    const res = await fetch(`${this.apiUrl}/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    return res.json();
  }

  async delete(id: string): Promise<void> {
    const res = await fetch(`${this.apiUrl}/${id}`, {
      method: 'DELETE'
    });
    return res.json();
  }
}
