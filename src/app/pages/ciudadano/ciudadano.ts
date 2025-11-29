import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { UsuarioService } from '../../Services/usuario.service'; // ajusta ruta según tu estructura
import { COMPARTIR_IMPORTS } from '../../shared/imports';
import { FormRegistro } from '../../Logic/solicitudes-comp/vista-solicitudes/form-registro/form-registro';
import { CardsSolicitud } from '../../Logic/solicitudes-comp/cards-solicitud/cards-solicitud';
import { RouterLink } from '@angular/router';
import { CardsRecoleccionCiudadano } from '../../Logic/recolecciones-comp/cards-recoleccion-ciudadano/cards-recoleccion-ciudadano';
import { Mapa } from '../../Logic/puntos-recoleccion/mapa/mapa';
import { BarraLateral } from '../../shared/barra-lateral/barra-lateral';
import { Boton } from '../../shared/botones/boton/boton';

@Component({
  selector: 'app-ciudadano',
  standalone: true,
  imports: [COMPARTIR_IMPORTS, FormRegistro, CardsSolicitud, CardsRecoleccionCiudadano, Mapa,BarraLateral,Boton],
  templateUrl: './ciudadano.html',
  styleUrls: ['./ciudadano.css']
})
export class Ciudadano {

  menuAbierto: boolean = true;       
  perfilMenuAbierto: boolean = false; 
  vistaActual: 'panel' | 'solicitudes' | 'recolecciones' | 'capacitaciones' | 'noticias' = 'panel'; 
  mostrarNuevaSolicitud = false;
  nombreUsuario: string = localStorage.getItem('nombreUsuario') ?? 'Usuario';
  nombreRol: string = localStorage.getItem('nombreRol') ?? 'Rol';

  constructor(
    private usuarioService: UsuarioService,
    private router: Router
  ) {}

  menu: { 
  vista: 'panel' | 'solicitudes' | 'recolecciones' | 'capacitaciones' | 'noticias',
  label: string,
  icon: string
}[] = [
  { vista: 'panel', label: 'Panel de Control', icon: 'bi bi-speedometer2' },
  { vista: 'solicitudes', label: 'Solicitudes', icon: 'bi bi-bar-chart-line' },
  { vista: 'recolecciones', label: 'Recolecciones', icon: 'bi bi-truck' },
  { vista: 'capacitaciones', label: 'Capacitaciones', icon: 'bi bi-mortarboard-fill' },
  { vista: 'noticias', label: 'Noticias', icon: 'bi bi-newspaper' },
];



  toggleVista(): void {
    this.mostrarNuevaSolicitud = !this.mostrarNuevaSolicitud;
  }

  toggleMenu(): void {
    this.menuAbierto = !this.menuAbierto;
    if (!this.menuAbierto) {
      this.perfilMenuAbierto = false; 
    }
  }

  // ========================
  // CAMBIAR VISTA
  // ========================
  cambiarVista(vista: 'panel'|'solicitudes'|'recolecciones'|'capacitaciones'|'noticias') {
    this.vistaActual = vista;
  }

  togglePerfilMenu(): void {
    this.perfilMenuAbierto = !this.perfilMenuAbierto;
  }

  // ========================
  // 🚪 CERRAR SESIÓN
  // ========================
  cerrarSesion(): void {
    this.usuarioService.logout(); // limpia el localStorage
    this.router.navigate(['/']); // redirige al index

    // Opcional: mensaje de confirmación
    alert('Sesión cerrada correctamente');
  }
}
