import { Injectable } from '@angular/core'
import { HttpClient, HttpParams } from '@angular/common/http'
import { Observable } from 'rxjs'
import { UsuarioModel } from '../usuario_models/usuario'

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {
  private apiUrlSpringboot = 'http://localhost:8082/api/personas'

  constructor(private http: HttpClient) { }

  // ========================
  //  LISTAR TODOS
  // ========================
  listar(): Observable<UsuarioModel[]> {
    return this.http.get<UsuarioModel[]>(this.apiUrlSpringboot)
  }

  // ========================
  //  OBTENER POR ID
  // ========================
  obtenerPorId(id: number): Observable<UsuarioModel> {
    return this.http.get<UsuarioModel>(`${this.apiUrlSpringboot}/filtrar-id/${id}`)
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

  // ========================
  //  FILTRO CONDICIONAL CENTRALIZADO
  // ========================
  filtrar(criterio: string, valor: string): Observable<UsuarioModel[]> {
    switch (criterio) {
      case 'nombre':
        return this.filtrarPorNombre(valor)
      case 'documento':
        return this.filtrarPorDocumento(valor)
      case 'correo':
        return this.filtrarPorCorreo(valor)
      default:
        console.warn('Criterio de filtro no reconocido:', criterio)
        return this.listar() // Si no hay criterio válido, devolvemos todo
    }
  }

  // ========================
  // CRUD
  // ========================
  guardar(usuario: UsuarioModel): Observable<UsuarioModel> {
    return this.http.post<UsuarioModel>(this.apiUrlSpringboot, usuario)
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

    return this.http.get(`${this.apiUrlSpringboot}/export/pdf`, {
      responseType: 'blob',
      params
    });
  }

  // ✅ Excel con filtros opcionales
  descargarExcel(filtros?: { nombre?: string; correo?: string; documento?: string }): Observable<Blob> {
    let params = new HttpParams();
    if (filtros) {
      if (filtros.nombre) params = params.set('nombre', filtros.nombre);
      if (filtros.correo) params = params.set('correo', filtros.correo);
      if (filtros.documento) params = params.set('documento', filtros.documento);
    }

    return this.http.get(`${this.apiUrlSpringboot}/export/excel`, {
      responseType: 'blob',
      params
    });
  }
}
