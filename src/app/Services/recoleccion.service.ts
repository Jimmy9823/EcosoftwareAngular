import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ModeloRecoleccion, EstadoRecoleccion } from '../Models/modelo-recoleccion';

@Injectable({
  providedIn: 'root'
})
export class RecoleccionService {

  private readonly URL = 'http://localhost:8082/api/recolecciones';

  constructor(private http: HttpClient) {}

  // ✅ OBTENER RECOLECCIÓN POR ID
  obtenerPorId(id: number): Observable<ModeloRecoleccion> {
    return this.http.get<ModeloRecoleccion>(`${this.URL}/${id}`);
  }

  // ✅ LISTAR RECOLECCIONES ACTIVAS
  listarActivas(): Observable<ModeloRecoleccion[]> {
    return this.http.get<ModeloRecoleccion[]>(`${this.URL}/activas`);
  }

  // ✅ LISTAR RECOLECCIONES DEL RECOLECTOR ACTUAL
  listarMisRecolecciones(): Observable<ModeloRecoleccion[]> {
    return this.http.get<ModeloRecoleccion[]>(`${this.URL}/mis-recolecciones`);
  }

  // ✅ LISTAR RECOLECCIONES POR RUTA
  listarPorRuta(idRuta: number): Observable<ModeloRecoleccion[]> {
    return this.http.get<ModeloRecoleccion[]>(`${this.URL}/ruta/${idRuta}`);
  }

  // ✅ ACTUALIZAR SOLO EL ESTADO
  actualizarEstado(id: number, estado: EstadoRecoleccion): Observable<ModeloRecoleccion> {
    return this.http.put<ModeloRecoleccion>(`${this.URL}/${id}/estado?estado=${estado}`, {});
  }

  // ✅ ACTUALIZAR COMPLETA RECOLECCIÓN
  actualizarRecoleccion(id: number, recoleccion: ModeloRecoleccion): Observable<ModeloRecoleccion> {
    return this.http.put<ModeloRecoleccion>(`${this.URL}/${id}`, recoleccion);
  }

  // ✅ ELIMINACIÓN LÓGICA (Cancelado)
  eliminarLogicamente(id: number): Observable<void> {
    return this.http.delete<void>(`${this.URL}/${id}`);
  }

}
