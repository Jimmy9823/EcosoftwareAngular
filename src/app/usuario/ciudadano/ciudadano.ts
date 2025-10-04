import { Component } from '@angular/core';
import { COMPARTIR_IMPORTS } from '../../ImpCondYForms/imports';

@Component({
  selector: 'app-ciudadano',
  standalone: true,
  imports: [COMPARTIR_IMPORTS],
  templateUrl: './ciudadano.html',
  styleUrls: ['./ciudadano.css']
})
export class Ciudadano {

  // ========================
  // PROPIEDADES
  // ========================
  menuAbierto: boolean = true;       
  perfilMenuAbierto: boolean = false; 
  vistaActual: 'panel' | 'solicitudes' | 'recolecciones' | 'capacitaciones' | 'noticias' = 'panel'; // vista inicial

  // ========================
  // MÉTODOS DEL SIDEBAR
  // ========================

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
}
