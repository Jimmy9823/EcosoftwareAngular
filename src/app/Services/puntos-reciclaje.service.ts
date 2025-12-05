import { Injectable } from '@angular/core';
import { HttpClient} from '@angular/common/http';
import { Observable } from 'rxjs';
import { PuntoReciclaje } from '../Models/puntos-reciclaje.model';

@Injectable({ providedIn: 'root' })
export class PuntosService {

 
  private url = 'http://localhost/puntos/Eco_Software-/api/puntos.php';

  constructor(private http: HttpClient) {}

  obtenerTodos(): Observable<any> {
    return this.http.get(this.url);
  }

  obtenerPorId(id: number): Observable<any> {
    return this.http.get(`${this.url}?id=${id}`);
  }

  crear(punto: Partial<PuntoReciclaje>): Observable<any> {
    return this.http.post(this.url, punto);
  }

  actualizar(id: number, punto: Partial<PuntoReciclaje>): Observable<any> {
    return this.http.put(`${this.url}?id=${id}`, punto);
  }

  eliminar(id: number): Observable<any> {
    return this.http.delete(`${this.url}?id=${id}`);
  }
}
