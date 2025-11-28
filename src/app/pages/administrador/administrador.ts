// src/app/usuario/administrador/administrador.ts
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { UsuarioService } from '../../Services/usuario.service';
import { UsuarioModel } from '../../Models/usuario';
import { COMPARTIR_IMPORTS } from '../../shared/imports';
import { Solcitudes } from '../../Logic/solicitudes-comp/listar-filtrar-solicitudes/solcitudes';
import { Usuario } from "../../Logic/usuarios.comp/listar-filtrar-usuarios/usuario";
import { RouterLink } from '@angular/router';
import { AuthService } from '../../auth/auth.service';
import { CapacitacionesLista } from '../../Logic/capacitaciones/listar-capacitaciones/listar-capacitaciones';
import { CargaMasiva } from '../../Logic/capacitaciones/carga-masiva/carga-masiva';
import { ListarTabla } from '../../Logic/recolecciones-comp/listar-tabla/listar-tabla';
import { GraficoUsuariosLocalidad } from '../../Logic/usuarios.comp/grafica-usuarios-localidad/grafica-usuarios-localidad';
import { GraficoUsuariosBarrios } from '../../Logic/usuarios.comp/grafica-usuarios-barrio/grafica-usuarios-barrio';
import { BarraLateral } from '../../shared/barra-lateral/barra-lateral';
import {SolicitudesLocalidadChartComponent} from "../../Logic/solicitudes-comp/solicitudes-localidad-chart-component/solicitudes-localidad-chart-component";

@Component({
  selector: 'app-administrador',
  imports: [COMPARTIR_IMPORTS, SolicitudesLocalidadChartComponent,GraficoUsuariosLocalidad, GraficoUsuariosBarrios ,Usuario, ListarTabla, Solcitudes, CapacitacionesLista, CargaMasiva,BarraLateral],
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

  menu: { 
  vista: 'panel'|'usuarios'|'solicitudes'|'recolecciones'|'puntos'|'capacitaciones'|'noticias',
  label: string,
  icon: string
}[] = [
  { vista: 'panel', label: 'Panel de Control', icon: 'bi bi-speedometer2' },
  { vista: 'usuarios', label: 'Usuarios', icon: 'bi bi-people' },
  { vista: 'solicitudes', label: 'Solicitudes', icon: 'bi bi-bar-chart-line' },
  { vista: 'recolecciones', label: 'Recolecciones', icon: 'bi bi-truck' },
  { vista: 'puntos', label: 'Puntos de Reciclaje', icon: 'bi bi-geo-alt' },
  { vista: 'capacitaciones', label: 'Capacitaciones', icon: 'bi bi-mortarboard-fill' },
  { vista: 'noticias', label: 'Noticias', icon: 'bi bi-newspaper' },
];



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
    this.router.navigate(['/']);
  }

  toggleMenu() {
    this.menuAbierto = !this.menuAbierto;
    if (!this.menuAbierto) this.perfilMenuAbierto = false;
  }

  togglePerfilMenu() {
    this.perfilMenuAbierto = !this.perfilMenuAbierto;
  }
}
