import { Injectable } from '@angular/core'
import { HttpClient, HttpParams } from '@angular/common/http'
import { Observable, throwError, of } from 'rxjs'
import { catchError, map } from 'rxjs/operators'
import { UsuarioModel } from '../Models/usuario'
import { AuthResponse } from '../Models/api-responses'
import { ApiService } from './api.service'

/**
 * Servicio para autenticación y gestión de usuario.
 */
@Injectable({
  providedIn: 'root'
})
export class UsuarioService {
  private apiUrlSpringboot = 'http://localhost:8082/api/personas';

  constructor(private http: HttpClient, private api: ApiService) {}

  // ========================
  //  LISTAR TODOS
  // ========================
  listar(): Observable<UsuarioModel[]> {
    return this.http.get<UsuarioModel[]>(this.apiUrlSpringboot).pipe(
      catchError(err => throwError(() => err))
    );
  }

  // ========================
  //  LOGIN
  // ========================
  login(correo: string, contrasena: string): Observable<UsuarioModel | null> {
    return this.listar().pipe(
      map(usuarios => {
        const encontrado = usuarios.find(
          u => u.correo === correo && u.contrasena === contrasena
        );
        return encontrado || null;
      }),
      catchError(err => {
        console.error(' Error en login', err);
        return throwError(() => err);
      })
    );
  }

  /**
   * Login contra API (Auth).
   */
  loginApi(credentials: { usuario: string; password: string }): Observable<AuthResponse> {
    return this.api.post<AuthResponse>('/api/auth/login', credentials).pipe(
      catchError(err => {
        // Devuelve un objeto compatible con AuthResponse
        return of({
          token: '',
          expiresIn: 0,
          usuario: { id: 0, nombre: '', rol: '' }
        });
      })
    );
  }

  // ========================
  //  OBTENER POR ID
  // ========================
  obtenerPorId(id: number): Observable<UsuarioModel> {
    return this.http.get<UsuarioModel>(`${this.apiUrlSpringboot}/${id}`).pipe(
      catchError(err => throwError(() => err))
    );
  }

  // ========================
  //  FILTROS INDIVIDUALES
  // ========================
  filtrarPorNombre(nombre: string): Observable<UsuarioModel[]> {
    return this.http.get<UsuarioModel[]>(`${this.apiUrlSpringboot}/filtrar-nombre?nombre=${nombre}`).pipe(
      catchError(err => throwError(() => err))
    );
  }

  filtrarPorDocumento(documento: string): Observable<UsuarioModel[]> {
    return this.http.get<UsuarioModel[]>(`${this.apiUrlSpringboot}/filtrar-documento?documento=${documento}`).pipe(
      catchError(err => throwError(() => err))
    );
  }

  filtrarPorCorreo(correo: string): Observable<UsuarioModel[]> {
    return this.http.get<UsuarioModel[]>(`${this.apiUrlSpringboot}/filtrar-correo?correo=${correo}`).pipe(
      catchError(err => throwError(() => err))
    );
  }

  filtrar(criterio: string, valor: string): Observable<UsuarioModel[]> {
    switch (criterio) {
      case 'nombre': return this.filtrarPorNombre(valor);
      case 'documento': return this.filtrarPorDocumento(valor);
      case 'correo': return this.filtrarPorCorreo(valor);
      default:
        console.warn('Criterio de filtro no reconocido:', criterio);
        return this.listar();
    }
  }

  // ========================
  // CRUD
  // ========================
  guardar(usuario: UsuarioModel): Observable<UsuarioModel> {
    return this.http.post<UsuarioModel>(`${this.apiUrlSpringboot}/registro`, usuario).pipe(
      catchError(err => throwError(() => err))
    );
  }

  actualizar(id: number, usuario: UsuarioModel): Observable<UsuarioModel> {
    return this.http.put<UsuarioModel>(`${this.apiUrlSpringboot}/${id}`, usuario).pipe(
      catchError(err => throwError(() => err))
    );
  }

 eliminarFisico(id: number): Observable<string> {
  return this.http.delete<string>(`${this.apiUrlSpringboot}/${id}`, {
    responseType: 'text' as 'json'
  }).pipe(
    catchError(err => throwError(() => err))
  );
}



 
eliminarLogico(id: number): Observable<string> {
  return this.http.patch<string>(`${this.apiUrlSpringboot}/eliminar/${id}`, null, {
    responseType: 'text' as 'json'
  }).pipe(
    catchError(err => throwError(() => err))
  );
}


  generarReporte(): Observable<UsuarioModel[]> {
    return this.http.get<UsuarioModel[]>(`${this.apiUrlSpringboot}/export/excel`).pipe(
      catchError(err => throwError(() => err))
    );
  }

  descargarPDF(filtros?: { nombre?: string; correo?: string; documento?: string }): Observable<Blob> {
    let params = new HttpParams();
    if (filtros) {
      if (filtros.nombre) params = params.set('nombre', filtros.nombre);
      if (filtros.correo) params = params.set('correo', filtros.correo);
      if (filtros.documento) params = params.set('documento', filtros.documento);
    }
    return this.http.get(`${this.apiUrlSpringboot}/export/pdf`, { responseType: 'blob', params }).pipe(
      catchError(err => throwError(() => err))
    );
  }

  descargarExcel(filtros?: { nombre?: string; correo?: string; documento?: string }): Observable<Blob> {
    let params = new HttpParams();
    if (filtros) {
      if (filtros.nombre) params = params.set('nombre', filtros.nombre);
      if (filtros.correo) params = params.set('correo', filtros.correo);
      if (filtros.documento) params = params.set('documento', filtros.documento);
    }
    return this.http.get(`${this.apiUrlSpringboot}/export/excel`, { responseType: 'blob', params }).pipe(
      catchError(err => throwError(() => err))
    );
  }
  obtenerUsuarioActual(): UsuarioModel | null {
    const data = localStorage.getItem('usuarioLogueado');
    return data ? JSON.parse(data) : null;
  }

  /**
   * Cierra sesión y limpia almacenamiento.
   */
  logout(): void {
    localStorage.clear();
    // ...otros pasos si es necesario
  }

  /**
   * Verifica si el token está expirado.
   */
  isTokenExpired(): boolean {
    const expiresIn = Number(localStorage.getItem('expiresIn'));
    if (!expiresIn) return true;
    return Date.now() > expiresIn;
  }

  /**
   * Prepara refresh token (sin implementar aún).
   */
  prepareRefreshToken(): void {
    // Aquí iría la lógica para refresh token
  }

  obtenerGraficoLocalidadRol(): Observable<any> {
    return this.http.get<any>(`${this.apiUrlSpringboot}/graficos/usuarios-localidad-rol`);
  }

  obtenerBarriosPorLocalidades(): Observable<any> {
    return this.http.get<any>(`${this.apiUrlSpringboot}/estadisticas/barrios-localidades`);
  }

}
