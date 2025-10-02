import { Component, OnInit } from '@angular/core'
import { UsuarioService } from '../usuario_services/usuario.service'
import { UsuarioModel } from '../usuario_models/usuario'
import { COMPARTIR_IMPORTS } from '../../ImpCondYForms/imports'
import { Header } from '../../shared/header/header'

@Component({
  selector: 'app-usuarios',
  imports: [COMPARTIR_IMPORTS, Header],
  templateUrl: './usuario.html',
  styleUrls: ['./usuario.css']
})
export class Usuario implements OnInit {
  usuarios: UsuarioModel[] = []
  cargando: boolean = false
  error: string = ''
  mensaje: string = ''
  rol: string = ''

  // Filtros
  criterio: string = 'nombre'
  valorFiltro: string = ''

  constructor(private usuarioService: UsuarioService) {}

  ngOnInit(): void {
    this.consultarUsuarios()
  }

  // ========================
  // CONSULTAR TODOS LOS USUARIOS
  // ========================
  consultarUsuarios(): void {
    this.cargando = true
    this.usuarioService.listar().subscribe({
      next: (lista) => {
        // 🔹 Mapeamos la lista para agregar el nombre de rol
        this.usuarios = lista.map(usuario => ({
          ...usuario,
          rol: this.obtenerNombreRol(usuario.rolId)
        }))

        this.cargando = false
        this.mensaje = `Se cargaron ${lista.length} usuario(s)`
        this.error = ''
      },
      error: (err) => {
        console.error('Error al cargar usuarios:', err)
        this.error = 'Error al cargar la lista de usuarios'
        this.mensaje = ''
        this.cargando = false
      }
    })
  }

  // ========================
  // FILTRAR USUARIOS
  // ========================
  aplicarFiltro(): void {
    if (!this.valorFiltro.trim()) {
      this.consultarUsuarios()
      return
    }

    this.cargando = true
    this.usuarioService.filtrar(this.criterio, this.valorFiltro).subscribe({
      next: (usuariosFiltrados) => {
        this.usuarios = usuariosFiltrados.map(usuario => ({
          ...usuario,
          rol: this.obtenerNombreRol(usuario.rolId)
        }))
        this.mensaje = ` ${usuariosFiltrados.length} usuario(s) encontrado(s)`
        this.error = ''
        this.cargando = false
      },
      error: (err) => {
        console.error('Error al filtrar usuarios:', err)
        this.error = 'Error al filtrar usuarios'
        this.mensaje = ''
        this.cargando = false
      }
    })
  }

  // ========================
  // LIMPIAR FILTRO
  // ========================
  limpiarFiltro(): void {
    this.valorFiltro = ''
    this.consultarUsuarios()
  }

  // ========================
  // OBTENER NOMBRE DE ROL
  // ========================
  private obtenerNombreRol(rolId: number): string {
    switch (rolId) {
      case 1: return 'Administrador'
      case 2: return 'Ciudadano'
      case 3: return 'Empresa'
      case 4: return 'Reciclador'
      default: return 'Desconocido'
    }
  }
}
