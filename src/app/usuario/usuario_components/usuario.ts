import { Component, OnInit } from '@angular/core'
import { UsuarioService } from '../usuario_services/usuario.service'
import { UsuarioModel } from '../usuario_models/usuario'
import { COMPARTIR_IMPORTS } from '../../ImpCondYForms/imports'

@Component({
  selector: 'app-usuario-tabla',
  templateUrl: './usuario.html',
  imports:[COMPARTIR_IMPORTS],
  styleUrls: ['./usuario.css']
})
export class Usuario implements OnInit {
  usuarios: UsuarioModel[] = []
  editandoId: number | null = null
  usuarioEditado: Partial<UsuarioModel> = {}
  cargando = false
  mensaje = ''
  error = ''

  roles = [
    { id: 1, nombre: 'Administrador' },
    { id: 2, nombre: 'Ciudadano' },
    { id: 3, nombre: 'Empresa' },
    { id: 4, nombre: 'Reciclador' }
  ]

  constructor(private usuarioService: UsuarioService) {}

  ngOnInit(): void {
    this.cargarUsuarios()
  }

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
      }
    })
  }

  activarEdicion(usuario: UsuarioModel): void {
    this.editandoId = usuario.idUsuario!
    this.usuarioEditado = { ...usuario }
  }

  cancelarEdicion(): void {
    this.editandoId = null
    this.usuarioEditado = {}
  }

  guardarCambios(usuario: UsuarioModel): void {
    if (!this.editandoId) return

    this.usuarioService.actualizar(this.editandoId, this.usuarioEditado as UsuarioModel).subscribe({
      next: () => {
        this.mensaje = 'Usuario actualizado correctamente'
        this.cancelarEdicion()
        this.cargarUsuarios()
      },
      error: (err) => {
        console.error('Error al actualizar:', err)
        this.error = 'No se pudo actualizar el usuario'
      }
    })
  }

  eliminarUsuario(id: number): void {
    if (confirm('¿Está seguro de que desea eliminar este usuario?')) {
      this.usuarioService.eliminarLogico(id).subscribe({
        next: () => {
          this.mensaje = 'Usuario eliminado correctamente'
          this.cargarUsuarios()
        },
        error: (err) => {
          console.error('Error al eliminar:', err)
          this.error = 'No se pudo eliminar el usuario'
        }
      })
    }
  }

  obtenerNombreRol(rolId: number | undefined): string {
    const rol = this.roles.find(r => r.id === rolId)
    return rol ? rol.nombre : 'Desconocido'
  }
}
