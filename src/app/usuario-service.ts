import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class UsuarioService {
  private apiUrlSpringboot= 'http://localhost:8080/api/personas';

constructor(private http: HttpClient){}

ping(): Observable<string> {
  return this.http.get(this.apiUrlSpringboot + '/ping', {responseType: 'text'});
}
}
