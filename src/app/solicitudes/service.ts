import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ServiceModel } from './model';

@Injectable({
  providedIn: 'root'
})
export class Service {

  private api="http://localhost:8082/api/solicitudes"

  constructor (private http:HttpClient) {

  }
  
  listar():Observable<ServiceModel[]> {
    return this.http.get<ServiceModel[]>
      (this.api)
  }


}
