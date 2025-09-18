import { Component, OnInit } from '@angular/core';
import { UsuarioService } from '../usuario_services/usuario.service';
import { UsuarioModel } from '../usuario_models/usuario';
import {COMPARTIR_IMPORTS} from '../../ImpCondYForms/imports'

@Component({
  selector: 'app-usuario',
  templateUrl: './usuario.html',
  styleUrl: './usuario.css',
  imports: [...COMPARTIR_IMPORTS]
})
export class Usuario implements OnInit {
  //
  usuarios: UsuarioModel[]=[];
  mensaje: string= '';
  cargando: boolean=true;
  error: string='';
  constructor(private usuarioService: UsuarioService){}

  ngOnInit():void {
    this.usuarioService.listar().subscribe({
      next: (data) => {
        this.usuarios = data;
        this.cargando = false;
        console.log(data);
      },
      
      error: (err) => {
        this.error = "error de conexion BE";
      this.cargando=false;
    }
    });
  }
}
