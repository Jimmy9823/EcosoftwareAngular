// src/app/usuario/administrador/administrador.ts
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { UsuarioService } from '../usuario_services/usuario.service';
import { UsuarioModel } from '../usuario_models/usuario';
import { COMPARTIR_IMPORTS } from '../../ImpCondYForms/imports';
import { Solcitudes } from '../../solcitudes/solcitudes';
import { Usuario } from "../usuario_components/usuario";
import { RouterLink } from '@angular/router';
import { PanelDeControl } from '../../core/panel-de-control/panel-de-control';
import { AuthService } from '../../auth/auth.service';
@Component({
  selector: 'app-administrador',
  imports: [COMPARTIR_IMPORTS, Solcitudes, Usuario, RouterLink, PanelDeControl],
  templateUrl: './administrador.html',
  styleUrl: './administrador.css'
})
export class Administrador {
  usuarios: UsuarioModel[] = [];
  usuarioActual: UsuarioModel | null = null;
  nombreUsuario: string = '';
  nombreRol: string = '';

  filtroNombre: string = '';
  filtroCorreo: string = '';
  filtroDocumento: string = '';
  cargando: boolean = false;
  error: string = '';
  mensaje: string = '';

  vistaActual:'panel'| 'usuarios' | 'solicitudes' | 'recolecciones' |'puntos'|'capacitaciones'|'noticias' = 'panel';

  menuAbierto = true;
  perfilMenuAbierto = false;

  constructor(
    private usuarioService: UsuarioService,
    private router: Router,
    private authService : AuthService
  ) {}

  ngOnInit(): void {
    this.vistaActual = 'panel';
    this.consultarUsuarios();

    // 🔸 Recuperar usuario logueado
    this.usuarioActual = this.usuarioService.obtenerUsuarioActual();
    if (this.usuarioActual) {
      this.nombreUsuario = this.usuarioActual.nombre;
      this.nombreRol = this.obtenerNombreRol(this.usuarioActual.rolId!);
    } else {
      // Si no hay sesión, redirige al login
     
    }
  }

  // ========================
  // CAMBIAR VISTA
  // ========================
  cambiarVista(vista: 'panel'|'usuarios'|'solicitudes'|'recolecciones'|'puntos'|'capacitaciones'|'noticias') {
    this.vistaActual = vista;
  }

  // ========================
  // CONSULTAR TODOS LOS USUARIOS
  // ========================
  consultarUsuarios(): void {
    this.cargando = true;
    this.usuarioService.listar().subscribe({
      next: (lista) => {
        this.usuarios = lista.map(usuario => ({
          ...usuario,
          rol: this.obtenerNombreRol(usuario.rolId!)
        }));

        this.cargando = false;
        this.mensaje = `Se cargaron ${lista.length} usuario(s)`;
        setTimeout(() => this.mensaje = '', 2500);
      },
      error: (err) => {
        console.error('Error al cargar usuarios:', err);
        this.error = 'Error al cargar la lista de usuarios';
        this.cargando = false;
        setTimeout(() => this.error = '', 2500);
      }
    });
  }

  // ========================
  // OBTENER NOMBRE DE ROL
  // ========================
  private obtenerNombreRol(rolId: number): string {
    switch (rolId) {
      case 1: return 'Administrador';
      case 2: return 'Ciudadano';
      case 3: return 'Empresa';
      case 4: return 'Reciclador';
      default: return 'Desconocido';
    }
  }

  // ========================
  // CERRAR SESIÓN
  // ========================
   logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  toggleMenu() {
    this.menuAbierto = !this.menuAbierto;
    if (!this.menuAbierto) this.perfilMenuAbierto = false;
  }

  togglePerfilMenu() {
    this.perfilMenuAbierto = !this.perfilMenuAbierto;
  }
}
