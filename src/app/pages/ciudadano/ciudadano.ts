import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { UsuarioService } from '../../Services/usuario.service'; // ajusta ruta según tu estructura
import { COMPARTIR_IMPORTS } from '../../shared/imports';
import { FormRegistro } from '../../Logic/solicitudes-comp/vista-solicitudes/form-registro/form-registro';
import { CardsSolicitud } from '../../Logic/solicitudes-comp/cards-solicitud/cards-solicitud';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-ciudadano',
  standalone: true,
  imports: [COMPARTIR_IMPORTS, FormRegistro, CardsSolicitud, RouterLink],
  templateUrl: './ciudadano.html',
  styleUrls: ['./ciudadano.css']
})
export class Ciudadano {

  menuAbierto: boolean = true;       
  perfilMenuAbierto: boolean = false; 
  vistaActual: 'panel' | 'solicitudes' | 'recolecciones' | 'capacitaciones' | 'noticias' = 'panel'; 
  mostrarNuevaSolicitud = false;

  constructor(
    private usuarioService: UsuarioService,
    private router: Router
  ) {}

  toggleVista(): void {
    this.mostrarNuevaSolicitud = !this.mostrarNuevaSolicitud;
  }

  toggleMenu(): void {
    this.menuAbierto = !this.menuAbierto;
    if (!this.menuAbierto) {
      this.perfilMenuAbierto = false; 
    }
  }

  cambiarVista(vista: 'panel' | 'solicitudes' | 'recolecciones' | 'capacitaciones' | 'noticias'): void {
    this.vistaActual = vista;
    this.perfilMenuAbierto = false;
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
