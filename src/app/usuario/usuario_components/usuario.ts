import { Component, OnInit } from '@angular/core'
import { UsuarioService } from '../usuario_services/usuario.service'
import { UsuarioModel } from '../usuario_models/usuario'
import { COMPARTIR_IMPORTS } from '../../ImpCondYForms/imports'

@Component({
  selector: 'app-usuario-tabla',
  templateUrl: './usuario.html',
  imports: [COMPARTIR_IMPORTS],
  styleUrls: ['./usuario.css']
})
export class Usuario implements OnInit {
  usuarios: UsuarioModel[] = []
  editandoId: number | null = null
  usuarioEditado: Partial<UsuarioModel> = {}
  cargando = false
  mensaje = ''
  error = ''

  // 🔸 Filtros
  filtroNombre: string = ''
  filtroCorreo: string = ''
  filtroDocumento: string = ''
  criterioSeleccionado: string = 'nombre' // valor inicial por defecto

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

  // ========================
  // CONSULTAR USUARIOS
  // ========================
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

  // ========================
  // APLICAR FILTRO
  // ========================
  aplicarFiltroDesdeForm(): void {
    const criterio = this.criterioSeleccionado
    let valor = ''
    if (criterio === 'nombre') valor = this.filtroNombre
    else if (criterio === 'correo') valor = this.filtroCorreo
    else if (criterio === 'documento') valor = this.filtroDocumento

    if (!valor || !valor.trim()) {
      this.cargarUsuarios()
      return
    }

    this.cargando = true
    this.usuarioService.filtrar(criterio, valor).subscribe({
      next: (usuariosFiltrados) => {
        this.usuarios = usuariosFiltrados
        this.mensaje = `${usuariosFiltrados.length} usuario(s) encontrado(s)`
        this.error = ''
        this.cargando = false
        setTimeout(() => (this.mensaje = ''), 2500)
      },
      error: (err) => {
        console.error('Error al filtrar usuarios:', err)
        this.error = 'Error al filtrar usuarios'
        this.mensaje = ''
        this.cargando = false
        setTimeout(() => {
          this.mensaje = ''
          this.error = ''
        }, 2500)
      }
    })
  }

  // ========================
  // LIMPIAR FILTRO
  // ========================
  limpiarFiltro(): void {
    this.filtroNombre = ''
    this.filtroCorreo = ''
    this.filtroDocumento = ''
    this.cargarUsuarios()
  }

  // ========================
  // EXPORTAR PDF
  // ========================
  exportarPDF(): void {
    const filtros = {
      nombre: this.filtroNombre || undefined,
      correo: this.filtroCorreo || undefined,
      documento: this.filtroDocumento || undefined
    }

    this.usuarioService.descargarPDF(filtros).subscribe((data: Blob) => {
      const blob = new Blob([data], { type: 'application/pdf' })
      const url = window.URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = 'usuarioReporte.pdf'
      link.click()
    })
  }

  // ========================
  // EXPORTAR EXCEL
  // ========================
  exportarExcel(): void {
    const filtros = {
      nombre: this.filtroNombre || undefined,
      correo: this.filtroCorreo || undefined,
      documento: this.filtroDocumento || undefined
    }

    this.usuarioService.descargarExcel(filtros).subscribe((data: Blob) => {
      const blob = new Blob([data], { type: 'application/vnd.ms-excel' })
      const url = window.URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = 'usuarioReporte.xlsx'
      link.click()
    })
  }

  // ========================
  // EDICIÓN / ELIMINACIÓN (ya existente)
  // ========================
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
