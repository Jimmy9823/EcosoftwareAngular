import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ServiceModel } from './model';

@Injectable({
  providedIn: 'root'
})
export class Service {

  private api = "http://localhost:8080/api/solicitudes"
  solicitud: ServiceModel[] = []
  constructor(private http: HttpClient) {

  }

  listar(): Observable<ServiceModel[]> {
    return this.http.get<ServiceModel[]>
      (this.api)
  }
  listarEstadoTrue(): Observable<ServiceModel[]> {
    return this.http.get<ServiceModel[]>
      (this.api)
  }
  aceptarSolicitud(id: number, solicitud: ServiceModel, id_recolector: number): Observable<ServiceModel> {
    return this.http.post<ServiceModel>(`${this.api}/${id}/aceptar/${id_recolector}`, solicitud)
  }
  rechazarSolicitud(id: number, solicitud: ServiceModel): Observable<ServiceModel> {
    return this.http.post<ServiceModel>(`${this.api}/${id}/rechazar`, solicitud)
  }

  
}