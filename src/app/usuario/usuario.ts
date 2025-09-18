import { Component, OnInit } from '@angular/core';
import { UsuarioService } from '../usuario-service';

@Component({
  selector: 'app-usuario',
  imports: [],
  templateUrl: './usuario.html',
  styleUrl: './usuario.css'
})
export class Usuario implements OnInit {
  mensaje: string= "";
  constructor(private usuarioService: UsuarioService){}

  ngOnInit():void {
    this.usuarioService.ping().subscribe({
      next: (data) => this.mensaje = data,
      error: (err) => this.mensaje = "error de conexion BE"
    });
  }
}
