import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:8080/api/auth';
  private TOKEN_KEY = 'jwt_token';
  private USER_KEY = 'user_data';

  constructor(private http: HttpClient) {}

  /** 🔐 Iniciar sesión */
  login(credentials: { correo: string; contrasena: string }): Observable<any> {
    return this.http.post(`${this.apiUrl}/login`, credentials).pipe(
      tap((response: any) => {
        if (response?.token) {
          // Guardar token y datos del usuario
          localStorage.setItem(this.TOKEN_KEY, response.token);
          localStorage.setItem(this.USER_KEY, JSON.stringify(response));
        }
      })
    );
  }

  /** 🚪 Cerrar sesión */
  logout(): void {
    localStorage.removeItem(this.TOKEN_KEY);
    localStorage.removeItem(this.USER_KEY);
  }

  /** 🎟 Obtener token actual */
  getToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  /** 👤 Obtener usuario actual (correo, rol, etc.) */
  getUser(): any {
    const data = localStorage.getItem(this.USER_KEY);
    return data ? JSON.parse(data) : null;
  }

  /** 🧠 Saber si hay sesión activa */
  isAuthenticated(): boolean {
    return !!this.getToken();
  }

  /** 🎭 Obtener rol del usuario */
  getUserRole(): string | null {
    const user = this.getUser();
    return user?.rol || null;
  }
}
