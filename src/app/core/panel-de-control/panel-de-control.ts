import { Component, ViewChild, computed } from '@angular/core';
import { VistaSolicitudes } from '../../usuario/administrador/vista-solicitudes/vista-solicitudes';
import { VistaUsuarios } from '../../usuario/administrador/vista-usuarios/vista-usuarios';
import { BarraLateral, BarraLateralItem } from '../../shared/barra-lateral/barra-lateral';
import { COMPARTIR_IMPORTS } from '../../ImpCondYForms/imports';


@Component({
  selector: 'app-panel-de-control-admin',
  imports: [VistaSolicitudes, VistaUsuarios, BarraLateral, COMPARTIR_IMPORTS],
  templateUrl: './panel-de-control.html',
  styleUrl: './panel-de-control.css'
})
export class PanelDeControl {
  vistaActual = 'usuarios'

  menuAdministrador: BarraLateralItem[] = [
    { id: 'usuarios', label: 'Usuarios', icon: '👩‍🔬' },             
  { id: 'solicitudes', label: 'Solicitudes', icon: '📨' },           
  { id: 'recolecciones', label: 'Recolecciones', icon: '🚛' },       
  { id: 'puntos-de-reciclaje', label: 'Puntos de Reciclaje', icon: '♻️' },
  { id: 'capacitaciones', label: 'Capacitaciones', icon: '🎓' },     
  { id: 'noticias', label: 'Noticias', icon: '📰' }     

  ]

  cambiarVista(vista: string): void {
    this.vistaActual = vista
  }
}

