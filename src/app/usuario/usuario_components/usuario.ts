import { Component, OnInit } from '@angular/core';
import { UsuarioService } from '../usuario_services/usuario.service';
import { UsuarioModel } from '../usuario_models/usuario';
import { COMPARTIR_IMPORTS } from '../../ImpCondYForms/imports';
import { Boton } from "../../shared/botones/boton/boton";

@Component({
  selector: 'app-usuario',
  standalone: true,             //  obligatorio para standalone
  templateUrl: './usuario.html',
  styleUrls: ['./usuario.css'],
  imports: [...COMPARTIR_IMPORTS, Boton]
})
export class Usuario implements OnInit {

  usuarios: UsuarioModel[] = [];
  mensaje: string = '';
  cargando: boolean = true;
  error: string = '';
  

  constructor(private usuarioService: UsuarioService) {}

  ngOnInit() {
    this.listarUsuarios();
  }

  listarUsuarios(): void {
    this.usuarioService.listar().subscribe({
      next: (data) => {
        this.usuarios = data;
        this.cargando = false;
        console.log(data);
      },
      error: (err) => {
        this.error = 'Error de conexión BE';
        this.cargando = false;
      }
    });
  }
  consultarPorId(id:number) {
    this.usuarioService.obtenerPorId(id).subscribe({
      next: (data)=> {
        this.usuarios = [data];
         this.cargando = false;
        console.log(data);
      },
      error: (err) => {
        this.error = 'Error de conexión BE';
        this.cargando = false;
      }
    })
  }
  consultarPorCorreo(){

  }
}
