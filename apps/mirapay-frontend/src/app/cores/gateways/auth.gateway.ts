import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { IUser, IRole } from '@mirapay/shared-models';

@Injectable({
  providedIn: 'root'
})
export class AuthGateway {
  private http = inject(HttpClient);
  private apiUrl = '/api';
  currentUser = signal<IUser | null>(null);

  async login(credentials: { emailOrUsername: string; password?: string }): Promise<{ user: IUser }> {
    try {
      const data = await firstValueFrom(
        this.http.post<{ user: IUser }>(`${this.apiUrl}/auth/login`, credentials)
      );
      this.currentUser.set(data.user);
      localStorage.setItem('user', JSON.stringify(data.user));
      return data;
    } catch (err: any) {
      throw new Error(err.error?.error || 'Erreur de connexion');
    }
  }

  async register(userData: Partial<IUser>): Promise<IUser> {
    try {
      return await firstValueFrom(
        this.http.post<IUser>(`${this.apiUrl}/users`, userData)
      );
    } catch (err: any) {
      throw new Error(err.error?.error || 'Erreur lors de la création');
    }
  }

  async getRoles(): Promise<IRole[]> {
    try {
      return await firstValueFrom(
        this.http.get<IRole[]>(`${this.apiUrl}/auth/roles`)
      );
    } catch (err) {
      return [];
    }
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
