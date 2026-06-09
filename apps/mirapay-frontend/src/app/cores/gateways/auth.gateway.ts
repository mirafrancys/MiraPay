import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { IUser, IRole } from '@mirapay/shared-models';

@Injectable({
  providedIn: 'root'
})
export class AuthGateway {
  private http = inject(HttpClient);
  private apiUrl = '/api';
  currentUser = signal<IUser | null>(null);

  login(credentials: { emailOrUsername: string; password?: string }): Observable<{ user: IUser }> {
    return this.http.post<{ user: IUser }>(`${this.apiUrl}/auth/login`, credentials).pipe(
      tap(data => {
        this.currentUser.set(data.user);
        localStorage.setItem('user', JSON.stringify(data.user));
      }),
      catchError(err => {
        const errMsg = err.error?.error || 'Erreur de connexion';
        return throwError(() => new Error(errMsg));
      })
    );
  }

  register(userData: Partial<IUser>): Observable<IUser> {
    return this.http.post<IUser>(`${this.apiUrl}/users`, userData).pipe(
      catchError(err => {
        const errMsg = err.error?.error || 'Erreur lors de la création';
        return throwError(() => new Error(errMsg));
      })
    );
  }

  getRoles(): Observable<IRole[]> {
    return this.http.get<IRole[]>(`${this.apiUrl}/auth/roles`).pipe(
      catchError(() => of([]))
    );
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
