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
 // Formulario adaptable para filtros

  constructor(private usuarioService: UsuarioService) {
    // Inicializar el formulario adaptable

  }

  ngOnInit() {
    this.listarUsuarios();
  }

  listarUsuarios(): void {
    this.usuarioService.listar().subscribe({
      next: (data) => {
        this.mensaje = "Usuarios cargados con éxito";
        this.usuarios = data;
        this.cargando = false;
        this.error = '';
        console.log(data);
      },
      error: (err) => {
        this.error = 'Error de conexión con el backend';
        this.cargando = false;
        this.mensaje = 'Error al cargar usuarios';
      }
    });
  }

 

  consultarPorId(id: number) {
    this.usuarioService.obtenerPorId(id).subscribe({
      next: (data) => {
        this.usuarios = [data];
        this.cargando = false;
        console.log(data);
      },
      error: (err) => {
        this.error = 'Error de conexión con el backend';
        this.cargando = false;
      }
    });
  }

  consultarPorCorreo(correo: string) {
    this.usuarioService.filtrarPorCorreo(correo).subscribe({
      next: (data) => {
        this.usuarios = data;
        this.cargando = false;
        console.log(data);
      },
      error: (err) => {
        this.error = 'Error al buscar por correo';
        this.cargando = false;
      }
    });
  }

  consultarPorDocumento(documento: string) {
    this.usuarioService.filtrarPorDocumento(documento).subscribe({
      next: (data) => {
        this.usuarios = data;
        this.cargando = false;
        console.log(data);
      },
      error: (err) => {
        this.error = 'Error al buscar por documento';
        this.cargando = false;
      }
    });
  }

  consultarPorNombre(nombre: string) {
    this.usuarioService.filtrarPorNombre(nombre).subscribe({
      next: (data) => {
        this.usuarios = data;
        this.cargando = false;
        console.log(data);
      },
      error: (err) => {
        this.error = 'Error al buscar por nombre';
        this.cargando = false;
      }
    });
  }

 

  eliminarUsuario(id: number) {
    this.usuarioService.eliminacionLogica(id).subscribe({
      next: (mensaje) => {
        this.mensaje = mensaje;
        this.usuarios = this.usuarios.filter(usuario => usuario.idUsuario !== id);
        console.log(mensaje);
      },
      error: (err) => {
        this.error = 'Error al eliminar usuario';
        console.log(err);
      }
    });
  }

  // Método para manejar el formulario adaptable
}

