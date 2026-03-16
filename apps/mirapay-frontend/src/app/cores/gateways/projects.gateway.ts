import { Injectable } from '@angular/core';
import { Project } from '@mirapay/shared-models';

@Injectable({
  providedIn: 'root'
})
export class ProjectsGateway {
  private apiUrl = '/api/projects';

  async getAll(): Promise<Project[]> {
    const res = await fetch(this.apiUrl);
    return res.json();
  }

  async getOne(id: string): Promise<Project> {
    const res = await fetch(`${this.apiUrl}/${id}`);
    return res.json();
  }

  async create(data: Partial<Project>): Promise<Project> {
    const res = await fetch(this.apiUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    return res.json();
  }

  async update(id: string, data: Partial<Project>): Promise<Project> {
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
