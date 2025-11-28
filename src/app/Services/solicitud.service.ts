import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ServiceModel } from '../Models/solicitudes.model';

// Interfaces para los datos de gráficos
export interface PendientesAceptadas {
  pendientes: number;
  aceptadas: number;
}

export interface RechazadasPorMotivo {
  motivo: string | null;
  cantidad: number;
}

export interface SolicitudesPorLocalidad {
  localidad: string;
  cantidad: number;
}

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

  listar(): Observable<ServiceModel[]> {
    return this.http.get<ServiceModel[]>(this.api);
  }

  obtenerPorId(id: number): Observable<ServiceModel> {
    return this.http.get<ServiceModel>(`${this.api}/${id}`);
  }

  crearSolicitud(solicitud: ServiceModel): Observable<ServiceModel> {
    return this.http.post<ServiceModel>(this.api, solicitud);
  }

  actualizarSolicitud(id: number, solicitud: ServiceModel): Observable<ServiceModel> {
    return this.http.put<ServiceModel>(`${this.api}/${id}`, solicitud);
  }

  // ================================
  // FILTROS Y ESTADOS
  // ================================

  listarPorEstado(estado: string): Observable<ServiceModel[]> {
    return this.http.get<ServiceModel[]>(`${this.api}/estado/${estado}`);
  }

  // ================================
  // ACCIONES: ACEPTAR / RECHAZAR
  // ================================

  aceptarSolicitud(id: number): Observable<ServiceModel> {
    return this.http.post<ServiceModel>(`${this.api}/${id}/aceptar`, {});
  }

  rechazarSolicitud(id: number, motivo: string): Observable<ServiceModel> {
    const params = new HttpParams().set('motivo', motivo);
    return this.http.post<ServiceModel>(`${this.api}/${id}/rechazar`, null, { params });
  }

  // ================================
  // EXPORTACIONES
  // ================================

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

  // ================================
  // NUEVOS MÉTODOS PARA GRÁFICOS
  // ================================

  getPendientesYAceptadas(): Observable<PendientesAceptadas> {
    return this.http.get<PendientesAceptadas>(`${this.api}/graficos/pendientes-aceptadas`);
  }

  getRechazadasPorMotivo(): Observable<RechazadasPorMotivo[]> {
    return this.http.get<any[]>(`${this.api}/graficos/rechazadas-por-motivo`).pipe(
      map(data => data.map(item => ({
        motivo: item[0],
        cantidad: item[1]
      })))
    );
  }

  getSolicitudesPorLocalidad(): Observable<SolicitudesPorLocalidad[]> {
    return this.http.get<any[]>(`${this.api}/graficos/solicitudes-por-localidad`).pipe(
      map(data => data.map(item => ({
        localidad: item[0],
        cantidad: item[1]
      })))
    );
  }
}