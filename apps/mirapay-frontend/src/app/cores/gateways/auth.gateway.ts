import { Injectable, signal } from '@angular/core';
import { User, Role } from '@mirapay/shared-models';

@Injectable({
  providedIn: 'root'
})
export class AuthGateway {
  private apiUrl = '/api';
  currentUser = signal<User | null>(null);

  async login(credentials: { emailOrUsername: string; password?: string }): Promise<{ user: User }> {
    const response = await fetch(`${this.apiUrl}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(credentials)
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Erreur de connexion');
    }

    const data = await response.json();
    this.currentUser.set(data.user);
    localStorage.setItem('user', JSON.stringify(data.user));
    return data;
  }

  async register(userData: Partial<User>): Promise<User> {
    const response = await fetch(`${this.apiUrl}/users`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userData)
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Erreur lors de la création');
    }

    return await response.json();
  }

  async getRoles(): Promise<Role[]> {
    const response = await fetch(`${this.apiUrl}/auth/roles`);
    if (!response.ok) return [];
    return await response.json();
  }

  logout() {
    this.currentUser.set(null);
    localStorage.removeItem('user');
  }

  checkAuth(): boolean {
    const user = localStorage.getItem('user');
    if (user) {
      this.currentUser.set(JSON.parse(user));
    }
    return !!user;
  }
}
