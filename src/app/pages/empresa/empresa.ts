import { Component } from '@angular/core';
import { UsuarioService } from '../../Services/usuario.service';
import { UsuarioModel } from '../../Models/usuario';
import { COMPARTIR_IMPORTS } from '../../shared/imports';
import { Router } from '@angular/router';
import { CardARSolicitud } from '../../Logic/solicitudes-comp/card-a-r-solicitud/card-a-r-solicitud';
import { CardsRecoleccion } from '../../Logic/recolecciones-comp/cards-recoleccion/cards-recoleccion';
import { BarraLateral } from '../../shared/barra-lateral/barra-lateral';

/**
 * Interfaz para los elementos del menú lateral.
 */
interface MenuItem {
  vista: 'panel' | 'solicitudes' | 'recolecciones' | 'puntos' | 'noticias';
  label: string;
  icon: string;
}

/**
 * Componente principal de la vista empresa.
 * Controla el menú lateral, la navegación y la sesión del usuario.
 */
@Component({
  selector: 'app-empresa',
  standalone: true,
  imports: [COMPARTIR_IMPORTS, CardARSolicitud, CardsRecoleccion, BarraLateral],
  templateUrl: './empresa.html',
  styleUrls: ['./empresa.css']
})
export class Empresa {

  // ========================
  // PROPIEDADES
  // ========================
  menuAbierto: boolean = true;
  perfilMenuAbierto: boolean = false;
  vistaActual: MenuItem['vista'] = 'panel'; // vista por defecto
  nombreUsuario: string = localStorage.getItem('nombreUsuario') ?? 'Usuario';
  nombreRol: string = localStorage.getItem('nombreRol') ?? 'Rol';

  menu: MenuItem[] = [
    { vista: 'panel', label: 'Panel de Control', icon: 'bi bi-speedometer2' },
    { vista: 'solicitudes', label: 'Solicitudes', icon: 'bi bi-bar-chart-line' },
    { vista: 'recolecciones', label: 'Recolecciones', icon: 'bi bi-truck' },
    { vista: 'puntos', label: 'Puntos de Reciclaje', icon: 'bi bi-geo-alt' },
    { vista: 'noticias', label: 'Noticias', icon: 'bi bi-newspaper' },
  ];

  /**
   * Dependencias inyectadas por el constructor:
   * - usuarioService: Servicio de usuario para autenticación y sesión.
   * - router: Router para navegación.
   */

  constructor(
    public usuarioService: UsuarioService,
    public router: Router
  ) {}

  // ========================
  // MÉTODOS DEL SIDEBAR
  // ========================

  /**
   * Alterna el estado del menú lateral.
   */
  toggleMenu(): void {
    this.menuAbierto = !this.menuAbierto;
    if (!this.menuAbierto) {
      this.perfilMenuAbierto = false; // cerrar perfil si colapsa
    }
  }

  /**
   * Cambia la vista actual del panel.
   * @param vista Vista seleccionada
   */
  cambiarVista(vista: MenuItem['vista']): void {
    this.vistaActual = vista;
    this.perfilMenuAbierto = false;
  }

  /**
   * Alterna el menú de perfil.
   */
  togglePerfilMenu(): void {
    this.perfilMenuAbierto = !this.perfilMenuAbierto;
  }

  /**
   * Cierra la sesión del usuario y redirige al inicio.
   */
  cerrarSesion(): void {
    this.usuarioService.logout(); // limpia el localStorage
    this.router.navigate(['/']); // redirige al index

    // Opcional: mensaje de confirmación
    alert('Sesión cerrada correctamente');
  }
}
