import { RegistroAdmin } from './../../auth/registro-admin/registro-admin';
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
import { RechazadasMotivoChartComponent } from '../../Logic/solicitudes-comp/rechazadas-motivo-chart-component/rechazadas-motivo-chart-component';
import { PendientesAceptadasChartComponent } from '../../Logic/solicitudes-comp/pendientes-aceptadas-chart-component/pendientes-aceptadas-chart-component';
import { Boton } from '../../shared/botones/boton/boton';
import { Titulo } from '../../shared/titulo/titulo';
import { Modal } from '../../shared/modal/modal';
import { EditarUsuario } from '../../Logic/usuarios.comp/editar-usuario/editar-usuario';
import { FormComp } from '../../shared/form/form.comp/form.comp';
import { Service } from '../../Services/solicitud.service';
import { Rutas } from "../../Logic/rutas/rutas";
@Component({
  selector: 'app-administrador',
  imports: [COMPARTIR_IMPORTS, SolicitudesLocalidadChartComponent, RechazadasMotivoChartComponent, PendientesAceptadasChartComponent, GraficoUsuariosLocalidad,
    GraficoUsuariosBarrios, RegistroAdmin, Usuario, ListarTabla, Solcitudes,
    EditarUsuario, CapacitacionesLista, CargaMasiva, BarraLateral, Boton, Titulo, Modal, FormComp, PuntosIframe, CrudPuntos, Rutas],
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

  vistaActual:'panel'|'editar-perfil'|'usuarios' | 'solicitudes' | 'recolecciones' |'puntos'|'capacitaciones'|'noticias' = 'panel';

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
    private puntosService: PuntosService,
    private solicitudService: Service
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

    // 🔍 DEBUGGING: Cargar datos reales de la API para verificar
    this.cargarDatosRealesParaDebug();
  }

  private cargarDatosRealesParaDebug(): void {
    console.group('📊 ANÁLISIS DE SOLICITUDES - DEBUG');

    // Obtener TODAS las solicitudes
    this.solicitudService.obtenerTodasLasSolicitudes().subscribe({
      next: (todas) => {
        console.log('📋 TODAS LAS SOLICITUDES:', todas);

        // Agrupar por localidad
        const porLocalidad: { [key: string]: number } = {};
        const porEstado: { [key: string]: number } = {};
        const porEstadoYLocalidad: { [estado: string]: { [localidad: string]: number } } = {};

        todas.forEach((sol: any) => {
          const loc = sol.localidad || sol.localidadDescripcion || 'Sin localidad';
          const estRaw = sol.estadoPeticion ?? sol.estado ?? 'Sin estado';
          const est = String(estRaw);

          // Contar por localidad
          porLocalidad[loc] = (porLocalidad[loc] || 0) + 1;

          // Contar por estado
          porEstado[est] = (porEstado[est] || 0) + 1;

          // Contar por estado Y localidad
          if (!porEstadoYLocalidad[est]) {
            porEstadoYLocalidad[est] = {};
          }
          porEstadoYLocalidad[est][loc] = (porEstadoYLocalidad[est][loc] || 0) + 1;
        });

        console.log('✅ SOLICITUDES POR LOCALIDAD:', porLocalidad);
        console.log('✅ SOLICITUDES POR ESTADO:', porEstado);
        console.log('✅ SOLICITUDES POR ESTADO Y LOCALIDAD:', porEstadoYLocalidad);

        // Resumen
        console.log(`📊 RESUMEN:
- Total solicitudes: ${todas.length}
- Localidades: ${Object.keys(porLocalidad).length}
- Estados: ${Object.keys(porEstado).length}
- Pendientes: ${porEstado['Pendiente'] || 0}
- Aceptadas: ${porEstado['Aceptada'] || 0}
- Rechazadas: ${porEstado['Rechazada'] || 0}`);
      },
      error: (err) => {
        console.error('❌ Error al obtener solicitudes:', err);
      }
    });

    // También intentar los endpoints específicos de gráficos
    console.group('📈 ENDPOINTS ESPECÍFICOS DE GRÁFICOS');

    this.solicitudService.getSolicitudesPorLocalidad().subscribe({
      next: (data) => {
        console.log('✅ getSolicitudesPorLocalidad:', data);
      },
      error: (err) => {
        console.warn('❌ getSolicitudesPorLocalidad falló:', err.message);
        this.solicitudService.getSolicitudesPorLocalidadFactory().subscribe({
          next: (data) => console.log('✅ getSolicitudesPorLocalidadFactory (fallback):', data),
          error: (e) => console.warn('❌ Fallback también falló:', e.message)
        });
      }
    });

    this.solicitudService.getPendientesYAceptadas().subscribe({
      next: (data) => {
        console.log('✅ getPendientesYAceptadas:', data);
      },
      error: (err) => {
        console.warn('❌ getPendientesYAceptadas falló:', err.message);
      }
    });

    this.solicitudService.getRechazadasPorMotivo().subscribe({
      next: (data) => {
        console.log('✅ getRechazadasPorMotivo:', data);
      },
      error: (err) => {
        console.warn('❌ getRechazadasPorMotivo falló:', err.message);
      }
    });

    console.groupEnd();
    console.groupEnd();
  }

  // Estado de autenticación para mostrar en UI
  get isAuthenticated(): boolean {
    return this.authService.isAuthenticated();
  }

  get tokenPreview(): string | null {
    const t = this.authService.getToken();
    if (!t) return null;
    return t.length > 24 ? `${t.slice(0,12)}...${t.slice(-8)}` : t;
  }

  // ========================
  // CAMBIAR VISTA
  // ========================
  cambiarVista(vista: 'panel'|'editar-perfil'|'usuarios'|'solicitudes'|'recolecciones'|'puntos'|'capacitaciones'|'noticias') {
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

  editarPerfil(): void {
    this.vistaActual = 'editar-perfil';
}
}
