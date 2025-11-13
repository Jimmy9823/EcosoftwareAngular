import { Injectable } from '@angular/core'
import { HttpClient, HttpParams } from '@angular/common/http'
import { Observable, map, throwError } from 'rxjs'
import { catchError } from 'rxjs/operators'
import { UsuarioModel } from '../Models/usuario'

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {
  private apiUrlSpringboot = 'http://localhost:8080/api/personas'

  constructor(private http: HttpClient) {}

  // ========================
  //  LISTAR TODOS
  // ========================
  listar(): Observable<UsuarioModel[]> {
    return this.http.get<UsuarioModel[]>(this.apiUrlSpringboot)
  }

  // ========================
  //  LOGIN
  // ========================
  login(correo: string, contrasena: string): Observable<UsuarioModel | null> {
    return this.listar().pipe(
      map(usuarios => {
        const encontrado = usuarios.find(
          u => u.correo === correo && u.contrasena === contrasena
        )
        return encontrado || null
      }),
      catchError(err => {
        console.error('❌ Error en login', err)
        return throwError(() => err)
      })
    )
  }

  // ========================
  //  OBTENER POR ID
  // ========================
  obtenerPorId(id: number): Observable<UsuarioModel> {
    return this.http.get<UsuarioModel>(`${this.apiUrlSpringboot}/${id}`)
  }

  // ========================
  //  FILTROS INDIVIDUALES
  // ========================
  filtrarPorNombre(nombre: string): Observable<UsuarioModel[]> {
    return this.http.get<UsuarioModel[]>(`${this.apiUrlSpringboot}/filtrar-nombre?nombre=${nombre}`)
  }

  filtrarPorDocumento(documento: string): Observable<UsuarioModel[]> {
    return this.http.get<UsuarioModel[]>(`${this.apiUrlSpringboot}/filtrar-documento?documento=${documento}`)
  }

  filtrarPorCorreo(correo: string): Observable<UsuarioModel[]> {
    return this.http.get<UsuarioModel[]>(`${this.apiUrlSpringboot}/filtrar-correo?correo=${correo}`)
  }

  filtrar(criterio: string, valor: string): Observable<UsuarioModel[]> {
    switch (criterio) {
      case 'nombre': return this.filtrarPorNombre(valor)
      case 'documento': return this.filtrarPorDocumento(valor)
      case 'correo': return this.filtrarPorCorreo(valor)
      default:
        console.warn('Criterio de filtro no reconocido:', criterio)
        return this.listar()
    }
  }

  // ========================
  // CRUD
  // ========================
  guardar(usuario: UsuarioModel): Observable<UsuarioModel> {
     console.log('📤 Enviando al backend:', usuario)
  console.log('🔗 URL:', `${this.apiUrlSpringboot}/registro`)
    return this.http.post<UsuarioModel>(`${this.apiUrlSpringboot}/registro`, usuario)
  }

  actualizar(id: number, usuario: UsuarioModel): Observable<UsuarioModel> {
    return this.http.put<UsuarioModel>(`${this.apiUrlSpringboot}/${id}`, usuario)
  }

  eliminarFisico(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrlSpringboot}/${id}`)
  }

  eliminarLogico(id: number): Observable<string> {
    return this.http.patch<string>(`${this.apiUrlSpringboot}/eliminar/${id}`, null)
  }

  generarReporte(): Observable<UsuarioModel[]> {
    return this.http.get<UsuarioModel[]>(`${this.apiUrlSpringboot}/export/excel`)
  }

  descargarPDF(filtros?: { nombre?: string; correo?: string; documento?: string }): Observable<Blob> {
    let params = new HttpParams();
    if (filtros) {
      if (filtros.nombre) params = params.set('nombre', filtros.nombre);
      if (filtros.correo) params = params.set('correo', filtros.correo);
      if (filtros.documento) params = params.set('documento', filtros.documento);
    }
    return this.http.get(`${this.apiUrlSpringboot}/export/pdf`, { responseType: 'blob', params })
  }

  descargarExcel(filtros?: { nombre?: string; correo?: string; documento?: string }): Observable<Blob> {
    let params = new HttpParams();
    if (filtros) {
      if (filtros.nombre) params = params.set('nombre', filtros.nombre);
      if (filtros.correo) params = params.set('correo', filtros.correo);
      if (filtros.documento) params = params.set('documento', filtros.documento);
    }
    return this.http.get(`${this.apiUrlSpringboot}/export/excel`, { responseType: 'blob', params })
  }
   obtenerUsuarioActual(): UsuarioModel | null {
    const data = localStorage.getItem('usuarioLogueado');
    return data ? JSON.parse(data) : null;
  }

  // ========================
  // CERRAR SESIÓN
  // ========================
  logout(): void {
    localStorage.removeItem('usuarioLogueado');
  }
}
