import { Registro } from './../../auth/registro/registro';
// src/app/usuario/administrador/administrador.ts
import { Component, ViewChild } from '@angular/core';
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
import { Mapa } from '../../Logic/puntos-recoleccion/mapa/mapa';
import { PuntosIframe } from '../../shared/puntos-iframe/puntos-iframe';
import { CrudPuntos } from '../../Logic/puntos-recoleccion/crud-puntos/crud-puntos';
import { PuntosService } from '../../Services/puntos-reciclaje.service';
import { PuntoReciclaje } from '../../Models/puntos-reciclaje.model';
import {SolicitudesLocalidadChartComponent} from "../../Logic/solicitudes-comp/solicitudes-localidad-chart-component/solicitudes-localidad-chart-component";
import { Boton } from '../../shared/botones/boton/boton';
import { Titulo } from '../../shared/titulo/titulo';
import { Modal } from '../../shared/modal/modal';
import { FormComp } from '../../shared/form/form.comp/form.comp';

@Component({
  selector: 'app-administrador',
  imports: [COMPARTIR_IMPORTS, SolicitudesLocalidadChartComponent,GraficoUsuariosLocalidad, GraficoUsuariosBarrios ,Usuario, ListarTabla, Solcitudes, CapacitacionesLista, CargaMasiva,BarraLateral,Boton,Titulo,Modal,FormComp, PuntosIframe, CrudPuntos],
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
  puntos: PuntoReciclaje[] = [];

  // botones de alternar vistas
  mostrarNuevoUsuario = false;
  capacitaciones = false;
  registro: any;

  @ViewChild(CrudPuntos) puntosCrud!: CrudPuntos;

    constructor(
    private usuarioService: UsuarioService,
    private router: Router,
    private authService : AuthService,
    private puntosService: PuntosService
  ) {}

  cargarPuntos(): void {
    this.puntosService.obtenerTodos().subscribe({
      next: (response) => {
        const data = Array.isArray(response) ? response : response.data;
        this.puntos = (data || []).map((p: any) => ({
          ...p,
          latitud: p.latitud !== null && p.latitud !== undefined ? parseFloat(String(p.latitud)) : null,
          longitud: p.longitud !== null && p.longitud !== undefined ? parseFloat(String(p.longitud)) : null
        }));
      },
      error: (err) => {
        console.error('Error al cargar puntos:', err);
      }
    });
  }

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

registroAdmin = [
  {
    icono: 'bi bi-download',
    texto: '',
    color: 'outline-custom-success',
    hoverColor: 'custom-success-filled',
    onClick: () => this.RegistroAdmin()   // Llama al método correctamente
  }
];


RegistroAdmin() {
  this.registro.emit();  // dispara el Output que ya tienes
}



// ========================
// Botones de alternar vistas
// ========================

// Alternar vista de capacitaciones
  toggleVista(): void {
    this.capacitaciones = !this.capacitaciones;
  }

  // Alternar vista de nuevo usuario
  toggleNuevoUsuario(): void {
    this.mostrarNuevoUsuario = !this.mostrarNuevoUsuario;
  }

  ngOnInit(): void {
    this.vistaActual = 'panel';
    this.consultarUsuarios();

    // Cargar puntos para el mapa cuando el admin abra la sección
    this.cargarPuntos();

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

  openCreateFromTitulo(): void {
    try {
      if (this.puntosCrud) this.puntosCrud.openCreate();
    } catch (e) {
      console.error('No se pudo abrir modal de crear punto:', e);
    }
  }
}
