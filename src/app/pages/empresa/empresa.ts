import { Component } from '@angular/core';
import { UsuarioService } from '../../Services/usuario.service';
import { UsuarioModel } from '../../Models/usuario';
import { COMPARTIR_IMPORTS } from '../../shared/imports';


import { RouterLink } from '@angular/router';
import { CardARSolicitud } from '../../Logic/solicitudes-comp/card-a-r-solicitud/card-a-r-solicitud';
import {CardsRecoleccion} from '../../Logic/recolecciones-comp/cards-recoleccion/cards-recoleccion';

@Component({
  selector: 'app-empresa',
  standalone: true,
  imports: [COMPARTIR_IMPORTS,  CardARSolicitud, RouterLink, CardsRecoleccion],
  templateUrl: './empresa.html',
  styleUrls: ['./empresa.css']
})
export class Empresa {

  // ========================
  // PROPIEDADES
  // ========================
  menuAbierto: boolean = true;    
  perfilMenuAbierto: boolean = false; 
  vistaActual: 'panel' | 'solicitudes' | 'recolecciones' | 'puntos' | 'noticias' = 'panel'; // vista por defecto


 
  // ========================
  // MÉTODOS DEL SIDEBAR
  // ========================

  toggleMenu(): void {
    this.menuAbierto = !this.menuAbierto;
    if (!this.menuAbierto) {
      this.perfilMenuAbierto = false; // cerrar perfil si colapsa
    }
  }

  cambiarVista(vista: 'panel' | 'solicitudes' | 'recolecciones' | 'puntos' | 'noticias'): void {
    this.vistaActual = vista;
    this.perfilMenuAbierto = false;
  }

  togglePerfilMenu(): void {
    this.perfilMenuAbierto = !this.perfilMenuAbierto;
  }
}
