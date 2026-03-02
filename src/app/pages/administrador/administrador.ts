import { RegistroAdmin } from './../../auth/registro-admin/registro-admin';
// src/app/usuario/administrador/administrador.ts
import { Component, ViewChild, ElementRef } from '@angular/core';
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
import { PuntosIframe } from '../../shared/puntos-iframe/puntos-iframe';
import { PuntosReciclajeService, PuntosResponse } from '../../Services/puntos-reciclaje.service';
import { PuntoReciclaje } from '../../Models/puntos-reciclaje.model';
import { SolicitudesLocalidadChartComponent } from "../../Logic/solicitudes-comp/solicitudes-localidad-chart-component/solicitudes-localidad-chart-component";
import { RechazadasMotivoChartComponent } from '../../Logic/solicitudes-comp/rechazadas-motivo-chart-component/rechazadas-motivo-chart-component';
import { PendientesAceptadasChartComponent } from '../../Logic/solicitudes-comp/pendientes-aceptadas-chart-component/pendientes-aceptadas-chart-component';
import { Boton } from '../../shared/botones/boton/boton';
import { Titulo } from '../../shared/titulo/titulo';
import { Modal } from '../../shared/modal/modal';
import { EditarUsuario } from '../../Logic/usuarios.comp/editar-usuario/editar-usuario';
import { FormComp } from '../../shared/form/form.comp/form.comp';
import { Service } from '../../Services/solicitud.service';
import { Rutas } from "../../Logic/rutas/rutas";
import { ReporteService } from '../../Services/reporte.service';
import { ServiceModel } from '../../Models/solicitudes.model';
import { AceptarRechazarUsuarios } from '../../Logic/usuarios.comp/aceptar-rechazar-usuarios/aceptar-rechazar-usuarios';
import { CardsNoticias } from "../../Logic/cards-noticias.component/cards-noticias.component";
import { MapaComponent } from '../mapa/mapa.component';

@Component({
  selector: 'app-administrador',
  imports: [COMPARTIR_IMPORTS, SolicitudesLocalidadChartComponent, AceptarRechazarUsuarios,
    RechazadasMotivoChartComponent, PendientesAceptadasChartComponent, GraficoUsuariosLocalidad,
    GraficoUsuariosBarrios, RegistroAdmin, Usuario, ListarTabla, Solcitudes,
    EditarUsuario, CapacitacionesLista, CargaMasiva, BarraLateral, Boton, Titulo, Modal, FormComp, PuntosIframe, MapaComponent, Rutas, CardsNoticias],
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
  cargandoReporte: boolean = false;

  vistaActual: 'panel' | 'editar-perfil' | 'usuarios' | 'solicitudes' | 'recolecciones' | 'Aceptar-Rechazar-Usuarios' | 'puntos' | 'capacitaciones' | 'noticias' = 'noticias';

  menuAbierto = true;
  perfilMenuAbierto = false;
  puntos: PuntoReciclaje[] = [];

  // botones de alternar vistas
  mostrarNuevoUsuario = false;
  capacitaciones = false;
  registro: any;

  // Referencias a gráficos para captura
  @ViewChild('usuariosGrafico') usuariosGrafico!: ElementRef;
  @ViewChild('solicitudesLocalidadGrafico') solicitudesLocalidadGrafico!: ElementRef;
  @ViewChild('rechazadasGrafico') rechazadasGrafico!: ElementRef;
  @ViewChild('estadoGrafico') estadoGrafico!: ElementRef;

  @ViewChild(MapaComponent) mapaComponent?: MapaComponent;

  // Lista de solicitudes para reportes
  solicitudes: ServiceModel[] = [];

  constructor(
    private usuarioService: UsuarioService,
    private router: Router,
    private authService: AuthService,
    private puntosService: PuntosReciclajeService,
    private solicitudService: Service,
    private reporteService: ReporteService
  ) { }

  cargarPuntos(): void {
    this.puntosService.getPuntos().subscribe({
      next: (response: PuntosResponse | PuntoReciclaje[]) => {
        const data = Array.isArray(response) ? response : response?.data ?? [];
        this.puntos = data.map((p: any) => ({
          ...p,
          latitud: p.latitud !== null && p.latitud !== undefined ? parseFloat(String(p.latitud)) : null,
          longitud: p.longitud !== null && p.longitud !== undefined ? parseFloat(String(p.longitud)) : null
        }));
      },
      error: (err: unknown) => {
        console.error('Error al cargar puntos:', err);
      }
    });
  }

  /**
   * Genera el reporte de usuarios en PDF
   */
  async generarReporteUsuarios(): Promise<void> {
    try {
      this.cargandoReporte = true;

      // Obtener el elemento del gráfico
      const graficoElement = this.usuariosGrafico?.nativeElement || null;

      // Generar el reporte
      await this.reporteService.generarReporteUsuarios(this.usuarios, graficoElement);

      this.mensaje = 'Reporte de usuarios generado exitosamente';
      setTimeout(() => this.mensaje = '', 3000);
    } catch (error) {
      console.error('Error al generar reporte de usuarios:', error);
      this.error = 'Error al generar el reporte de usuarios';
      setTimeout(() => this.error = '', 3000);
    } finally {
      this.cargandoReporte = false;
    }
  }

  /**
   * Genera el reporte de solicitudes en PDF
   */
  async generarReporteSolicitudes(): Promise<void> {
    try {
      this.cargandoReporte = true;

      // Cargar solicitudes si no las hay
      if (this.solicitudes.length === 0) {
        await new Promise((resolve, reject) => {
          this.solicitudService.listar().subscribe({
            next: (data) => {
              this.solicitudes = data;
              resolve(data);
            },
            error: reject
          });
        });
      }

      // Obtener referencias a los elementos de los gráficos
      const graficoElements = {
        localidad: this.solicitudesLocalidadGrafico?.nativeElement || null,
        rechazadas: this.rechazadasGrafico?.nativeElement || null,
        estado: this.estadoGrafico?.nativeElement || null
      };

      // Generar el reporte
      await this.reporteService.generarReporteSolicitudes(this.solicitudes, graficoElements);

      this.mensaje = 'Reporte de solicitudes generado exitosamente';
      setTimeout(() => this.mensaje = '', 3000);
    } catch (error) {
      console.error('Error al generar reporte de solicitudes:', error);
      this.error = 'Error al generar el reporte de solicitudes';
      setTimeout(() => this.error = '', 3000);
    } finally {
      this.cargandoReporte = false;
    }
  }

  menu: {
    vista: 'panel' | 'usuarios' | 'solicitudes' | 'recolecciones' | 'puntos' | 'capacitaciones' | 'noticias' |
    'Aceptar-Rechazar-Usuarios',
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

    
 
  this.usuarioService.contarPendientes().subscribe({
    next: (pendientes: number) => {

      // Si hay pendientes → mostrar vista Aceptar/Rechazar
      if (pendientes > 0) {
        this.vistaActual = 'Aceptar-Rechazar-Usuarios';
      } else {
        //Si  no hay pendientes → mostrar panel
        this.vistaActual = 'panel';
      }
    },
    error: (err) => {
      console.error('Error contando usuarios pendientes:', err);

      // Por seguridad, mostrar panel si falla
      this.vistaActual = 'panel';
    }
  });
    this.consultarUsuarios();

    // Cargar solicitudes para reportes
    this.solicitudService.listar().subscribe({
      next: (data) => {
        this.solicitudes = data;
      },
      error: (err) => {
        console.error('Error al cargar solicitudes:', err);
      }
    });

    // Cargar puntos para el mapa cuando el admin abra la sección
    this.cargarPuntos();

    // Recuperar usuario logueado
    this.usuarioActual = this.usuarioService.obtenerUsuarioActual();
    if (this.usuarioActual) {
      this.nombreUsuario = this.usuarioActual.nombre;
      this.nombreRol = this.obtenerNombreRol(this.usuarioActual.rolId!);
    } else {
      // Si no hay sesión, redirige al login

    }

    // DEBUGGING: Cargar datos reales de la API para verificar
    this.cargarDatosRealesParaDebug();
  }

  private cargarDatosRealesParaDebug(): void {
    console.group('ANÁLISIS DE SOLICITUDES - DEBUG');

    // Obtener TODAS las solicitudes
    this.solicitudService.obtenerTodasLasSolicitudes().subscribe({
      next: (todas) => {
        console.log('TODAS LAS SOLICITUDES:', todas);

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

        console.log('SOLICITUDES POR LOCALIDAD:', porLocalidad);
        console.log('SOLICITUDES POR ESTADO:', porEstado);
        console.log('SOLICITUDES POR ESTADO Y LOCALIDAD:', porEstadoYLocalidad);

        // Resumen
        console.log(`RESUMEN:
- Total solicitudes: ${todas.length}
- Localidades: ${Object.keys(porLocalidad).length}
- Estados: ${Object.keys(porEstado).length}
- Pendientes: ${porEstado['Pendiente'] || 0}
- Aceptadas: ${porEstado['Aceptada'] || 0}
- Rechazadas: ${porEstado['Rechazada'] || 0}`);
      },
      error: (err) => {
        console.error('Error al obtener solicitudes:', err);
      }
    });

    // También intentar los endpoints específicos de gráficos
    console.group('ENDPOINTS ESPECÍFICOS DE GRÁFICOS');

    this.solicitudService.getSolicitudesPorLocalidad().subscribe({
      next: (data) => {
        console.log('getSolicitudesPorLocalidad:', data);
      },
      error: (err) => {
        console.warn('getSolicitudesPorLocalidad falló:', err.message);
        this.solicitudService.getSolicitudesPorLocalidadFactory().subscribe({
          next: (data) => console.log('getSolicitudesPorLocalidadFactory (fallback):', data),
          error: (e) => console.warn('Fallback también falló:', e.message)
        });
      }
    });

    this.solicitudService.getPendientesYAceptadas().subscribe({
      next: (data) => {
        console.log('getPendientesYAceptadas:', data);
      },
      error: (err) => {
        console.warn('getPendientesYAceptadas falló:', err.message);
      }
    });

    this.solicitudService.getRechazadasPorMotivo().subscribe({
      next: (data) => {
        console.log('getRechazadasPorMotivo:', data);
      },
      error: (err) => {
        console.warn('getRechazadasPorMotivo falló:', err.message);
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
    return t.length > 24 ? `${t.slice(0, 12)}...${t.slice(-8)}` : t;
  }

  // ========================
  // CAMBIAR VISTA
  // ========================
  cambiarVista(vista: 'panel' | 'editar-perfil' | 'Aceptar-Rechazar-Usuarios' | 'usuarios' | 'solicitudes' | 'recolecciones' | 'puntos' | 'capacitaciones' | 'noticias') {
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
    const mapId = this.mapaComponent?.mapContainerId;
    if (!mapId) {
      console.warn('No se encontró el componente de mapa para enfocar.');
      return;
    }
    document.getElementById(mapId)?.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }

  editarPerfil(): void {
    this.vistaActual = 'editar-perfil';
  }
}
