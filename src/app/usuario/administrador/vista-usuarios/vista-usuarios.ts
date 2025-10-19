import { Component } from '@angular/core';
import { COMPARTIR_IMPORTS } from '../../../ImpCondYForms/imports';
import { Tabla } from '../../../shared/tabla/tabla';
import { UsuarioService } from '../../usuario_services/usuario.service';
import {UsuarioModel} from '../../../usuario/usuario_models/usuario'
@Component({
  selector: 'app-vista-usuarios',
  imports: [COMPARTIR_IMPORTS, Tabla ],
  templateUrl: './vista-usuarios.html',
  styleUrl: './vista-usuarios.css'
})
export class VistaUsuarios {

  cargando:boolean = false
  usuarios: UsuarioModel[]=[]
  error = ''
  constructor(private usuarioService: UsuarioService) {}

  
    ngOnInit(): void {
      this.cargarUsuarios()
    }
  columns = [
    { key: 'idUsuario', label: 'Id' },
    { key: 'nombre', label: 'Nombre' },
    { key: 'correo', label: 'Correo Electrónico' },
    { key: 'telefono', label: 'Telefono' }
  ]

  data: any []=[]

  cargarUsuarios(): void {
    this.cargando = true
    this.usuarioService.listar().subscribe({
      next: (data) => {
        this.usuarios = data
        this.cargando = false
      },
      error: (err) => {
        console.error('Error al cargar usuarios:', err)
        this.error = 'Error al cargar usuarios'
        this.cargando = false
        setTimeout(() => this.error = '', 2500);
      }
    })
  }
}
