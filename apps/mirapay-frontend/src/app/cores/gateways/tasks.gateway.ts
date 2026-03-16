import { Injectable } from '@angular/core';
import { Task } from '@mirapay/shared-models';

@Injectable({
  providedIn: 'root'
})
export class TasksGateway {
  private apiUrl = '/api/tasks';

  async getByProject(projectId: string): Promise<Task[]> {
    const res = await fetch(`${this.apiUrl}/project/${projectId}`);
    return res.json();
  }

  async getOne(id: string): Promise<Task> {
    const res = await fetch(`${this.apiUrl}/${id}`);
    return res.json();
  }

  async create(data: Partial<Task>): Promise<Task> {
    const res = await fetch(this.apiUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    return res.json();
  }

  async update(id: string, data: Partial<Task>): Promise<Task> {
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
