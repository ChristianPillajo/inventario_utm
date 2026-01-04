import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

import { LoginRequest, User } from '../models/login.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:8080/api';
  private currentUserKey = 'current_user';

  constructor(
    private http: HttpClient,
    private router: Router
  ) {}

  // Método principal - POST a tu endpoint
  login(credentials: LoginRequest): Observable<boolean> {
    return this.http.post<any>(`${this.apiUrl}/auth/login`, credentials)
      .pipe(
        map(response => {
          // Guardar usuario en localStorage
          localStorage.setItem(this.currentUserKey, JSON.stringify(response));
          return true;
        }),
        catchError(error => {
          console.error('Login error:', error);
          return of(false);
        })
      );
  }

  // Login alternativo si el endpoint no existe
  loginSimple(email: string, password: string): Observable<boolean> {
    // Solo para desarrollo - sin verificación real
    const mockUser: User = {
      id: 1,
      nombre: 'Administrador',
      email: email,
      rol: 'ADMIN'
    };

    localStorage.setItem(this.currentUserKey, JSON.stringify(mockUser));
    return of(true);
  }

  // Verificar si hay usuario logueado
  isLoggedIn(): boolean {
    return localStorage.getItem(this.currentUserKey) !== null;
  }

  // Obtener usuario actual
  getCurrentUser(): User | null {
    const userStr = localStorage.getItem(this.currentUserKey);
    return userStr ? JSON.parse(userStr) : null;
  }

  // Cerrar sesión
  logout(): void {
    localStorage.removeItem(this.currentUserKey);
    this.router.navigate(['/login']);
  }
}
