import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ServiceModel } from '../Models/model';

@Injectable({
  providedIn: 'root'
})
export class Service {

  private api = 'http://localhost:8082/api/solicitudes';
  solicitud: ServiceModel[] = [];

  constructor(private http: HttpClient) {}

  // ================================
  // CRUD BÁSICO
  // ================================

  // Listar todas las solicitudes
  listar(): Observable<ServiceModel[]> {
    return this.http.get<ServiceModel[]>(this.api);
  }

  // Obtener solicitud por ID
  obtenerPorId(id: number): Observable<ServiceModel> {
    return this.http.get<ServiceModel>(`${this.api}/${id}`);
  }

  // Crear nueva solicitud
  crearSolicitud(solicitud: ServiceModel): Observable<ServiceModel> {
    return this.http.post<ServiceModel>(this.api, solicitud);
  }

  // Actualizar solicitud
  actualizarSolicitud(id: number, solicitud: ServiceModel): Observable<ServiceModel> {
    return this.http.put<ServiceModel>(`${this.api}/${id}`, solicitud);
  }

  // ================================
  // FILTROS Y ESTADOS
  // ================================

  // Listar solicitudes por estado (ej: PENDIENTE, ACEPTADA, RECHAZADA)
  listarPorEstado(estado: string): Observable<ServiceModel[]> {
    return this.http.get<ServiceModel[]>(`${this.api}/estado/${estado}`);
  }

  // ================================
  // ACCIONES: ACEPTAR / RECHAZAR
  // ================================

  // Aceptar solicitud
  aceptarSolicitud(id: number): Observable<ServiceModel> {
  return this.http.post<ServiceModel>(`${this.api}/${id}/aceptar`, {});
}

  // Rechazar solicitud con motivo
 rechazarSolicitud(id: number, motivo: string): Observable<ServiceModel> {
  const params = new HttpParams().set('motivo', motivo);
  return this.http.post<ServiceModel>(`${this.api}/${id}/rechazar`, null, { params });
}

  // ================================
  // EXPORTACIONES
  // ================================

  // Exportar a Excel con filtros opcionales
  exportarExcel(estado?: string, localidad?: string, fechaDesde?: string, fechaHasta?: string): Observable<Blob> {
    let params = new HttpParams();
    if (estado) params = params.set('estado', estado);
    if (localidad) params = params.set('localidad', localidad);
    if (fechaDesde) params = params.set('fechaDesde', fechaDesde);
    if (fechaHasta) params = params.set('fechaHasta', fechaHasta);

    return this.http.get(`${this.api}/export/excel`, {
      params,
      responseType: 'blob'
    });
  }

  // Exportar a PDF con filtros opcionales
  exportarPDF(estado?: string, localidad?: string, fechaDesde?: string, fechaHasta?: string): Observable<Blob> {
    let params = new HttpParams();
    if (estado) params = params.set('estado', estado);
    if (localidad) params = params.set('localidad', localidad);
    if (fechaDesde) params = params.set('fechaDesde', fechaDesde);
    if (fechaHasta) params = params.set('fechaHasta', fechaHasta);

    return this.http.get(`${this.api}/export/pdf`, {
      params,
      responseType: 'blob'
    });
  }
}
