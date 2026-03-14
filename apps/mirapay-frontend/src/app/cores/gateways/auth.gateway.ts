import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthGateway {
  private apiUrl = '/api';
  currentUser = signal<any>(null);

  async login(credentials: any) {
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

  async register(userData: any) {
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

  async getRoles() {
    const response = await fetch(`${this.apiUrl}/auth/roles`);
    if (!response.ok) return [];
    return await response.json();
  }

  logout() {
    this.currentUser.set(null);
    localStorage.removeItem('user');
  }

  checkAuth() {
    const user = localStorage.getItem('user');
    if (user) {
      this.currentUser.set(JSON.parse(user));
    }
    return !!user;
  }
}
