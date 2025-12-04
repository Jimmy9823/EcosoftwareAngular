import { Component, ViewChild } from '@angular/core';
import { COMPARTIR_IMPORTS } from '../../shared/imports';
import { BarraLateral } from '../../shared/barra-lateral/barra-lateral';
import { Titulo } from '../../shared/titulo/titulo';
import { CrudPuntos } from '../../Logic/puntos-recoleccion/crud-puntos/crud-puntos';
import { PuntosService } from '../../Services/puntos-reciclaje.service';
import { UsuarioService } from '../../Services/usuario.service';

@Component({
  selector: 'app-reciclador',
  standalone: true,
  imports: [COMPARTIR_IMPORTS, BarraLateral, Titulo, CrudPuntos],
  templateUrl: './reciclador.html',
  styleUrls: ['./reciclador.css']
})
export class Reciclador {
  menuAbierto: boolean = true;
  vistaActual: 'panel' | 'puntos' | 'recolecciones' = 'panel';
  @ViewChild(CrudPuntos) puntosCrud!: CrudPuntos;

  constructor(
    public usuarioService: UsuarioService,
    private puntosService: PuntosService
  ) {}

  toggleMenu(): void { this.menuAbierto = !this.menuAbierto; }

  abrirCrearPunto(): void {
    try { this.puntosCrud?.openCreate(); } catch (e) { console.warn('puntosCrud not ready', e); }
  }
}
