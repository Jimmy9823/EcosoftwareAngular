import { Injectable } from '@angular/core';
import { ModeloRecoleccion } from '../model/modelo-recoleccion';

@Injectable({
  providedIn: 'root'
})
export class ServicioRecoleccion {
  private api = "http://localhost:8082/api/solicitudes"
  
}
