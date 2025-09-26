import { Component, OnInit } from '@angular/core';
import { UsuarioService } from '../usuario_services/usuario.service';
import { UsuarioModel } from '../usuario_models/usuario';
import { COMPARTIR_IMPORTS } from '../../ImpCondYForms/imports';
import { Boton } from "../../shared/botones/boton/boton";
import { FormComp } from '../../shared/form/form.comp/form.comp';
import { FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-usuario',
  standalone: true,             //  obligatorio para standalone
  templateUrl: './usuario.html',
  styleUrls: ['./usuario.css'],
  imports: [...COMPARTIR_IMPORTS, Boton, FormComp]
})
export class Usuario implements OnInit {

  usuarios: UsuarioModel[] = [];
  mensaje: string = '';
  cargando: boolean = true;
  error: string = '';
  filtroForm: FormGroup; // Formulario adaptable para filtros

  constructor(private usuarioService: UsuarioService, private fb: FormBuilder) {
    // Inicializar el formulario adaptable
    this.filtroForm = this.fb.group({
      filtro: [''], // Campo para el valor del filtro
      tipoFiltro: ['correo'] // Tipo de filtro: correo, documento, nombre
    });
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

  guardarUsuario(data: any) {
    this.usuarioService.guardarUsuario(data).subscribe({
      next: (nuevoUsuario) => {
        this.cargando = false;
        this.usuarios.push(nuevoUsuario);
      },
      error: (err) => {
        this.error = 'Error al ingresar usuario nuevo';
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
  buscarConFiltro() {
    const { filtro, tipoFiltro } = this.filtroForm.value;
    if (tipoFiltro === 'correo') {
      this.consultarPorCorreo(filtro);
    } else if (tipoFiltro === 'documento') {
      this.consultarPorDocumento(filtro);
    } else if (tipoFiltro === 'nombre') {
      this.consultarPorNombre(filtro);
    }
  }
}

