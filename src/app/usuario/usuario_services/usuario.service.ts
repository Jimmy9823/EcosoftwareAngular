import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
//Importar el model usuario
import { UsuarioModel } from '../usuario_models/usuario';

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {
  //Defino la url principal, sale de la url base mas el endpoint del controller de Springboot
  //url principal:http://localhost:8080 + endpoint usuariosController: /api/personas
  // apiUrlSpringboot es una variable que contiene mi url base
  private apiUrlSpringboot= 'http://localhost:8080/api/personas';
//Creo un constructor vacio con la variable http de tipo HttpClient
constructor(private http: HttpClient){}
//Defino mi primer metodo, basado en los metodos del controlador del back
//listar() Nombre del metodo
// : ObservableObservable es un tipo de objeto de RxJS
// , que representa una secuencia de datos que se recibirán en el futuro 
// (por ejemplo, cuando llegue la respuesta de la API).
// <string> recibe datos de tipo string
//No definir como String con mayuscula
listar(): Observable<UsuarioModel[]> {
  return this.http.get<UsuarioModel[]>(this.apiUrlSpringboot);
}
obtenerPorId(id: number): Observable<UsuarioModel> {
  return this.http.get<UsuarioModel>(`${this.apiUrlSpringboot}/filtrar-id/${id}`);
}
filtrarPorNombre(nombre:string): Observable<UsuarioModel[]> {
  return this.http.get<UsuarioModel[]>(`${this.apiUrlSpringboot}/filtrar-nombre?nombre=${nombre}`);
}
filtrarPorDocumento(documento:string): Observable<UsuarioModel[]> {
  return this.http.get<UsuarioModel[]>(`${this.apiUrlSpringboot}/filtrar-documento?documento=${documento}`);
}
filtrarPorCorreo(correo:string) : Observable<UsuarioModel[]> {
  return this.http.get<UsuarioModel[]>(`${this.apiUrlSpringboot}/filtrar-correo?correo=${correo}`);
}
guardarUsuario(usuario:UsuarioModel): Observable<UsuarioModel>{
  return this.http.post<UsuarioModel>(this.apiUrlSpringboot, usuario)
}
//this.http.get es porque tengo un tipo get en el controlador,
//aqui puede cambiar a put, delete, post, etc...
actualizarUsuario(id:number, usuario:UsuarioModel): Observable<UsuarioModel>{
  return this.http.put<UsuarioModel>(`${this.apiUrlSpringboot}/${id}`, usuario) 
}
eliminarUsuario(id:number): Observable<void>{
  return this.http.delete<void>(`${this.apiUrlSpringboot}/${id}`); 
}
eliminacionLogica(id: number): Observable<string> {
  return this.http.patch<string>(`${this.apiUrlSpringboot}/eliminar/${id}`, null);
}
}
