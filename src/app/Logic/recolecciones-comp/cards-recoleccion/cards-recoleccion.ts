import { Component, OnInit } from '@angular/core';
import { COMPARTIR_IMPORTS } from '../../../shared/imports';
import { RecoleccionService } from '../../../Services/recoleccion.service';
import { ModeloRecoleccion, EstadoRecoleccion } from '../../../Models/modelo-recoleccion';


@Component({
  selector: 'app-cards-recoleccion',
  imports: [COMPARTIR_IMPORTS],
  templateUrl: './cards-recoleccion.html',
  styleUrl: './cards-recoleccion.css'
})
export class CardsRecoleccion implements OnInit {

  recolecciones: ModeloRecoleccion[] = [];
  cargando = true;
  error = '';

  constructor(private recoleccionService: RecoleccionService) { }

  ngOnInit(): void {
    this.cargarMisRecolecciones()
  }

  cargarMisRecolecciones(): void {
    this.recoleccionService.listarMisRecolecciones().subscribe({
      next: (data) => {
        this.recolecciones = data
      },
      error: (err) => {
        console.error('Error al cargar mis recolecciones', err)
      }
    })
  }

  mostrarBotones(estado: string): boolean {
    return estado !== 'Completada' && estado !== 'Cancelada'
  }

  aceptarRecoleccion(id: number) {
    this.recoleccionService.actualizarEstado(id, EstadoRecoleccion.Completada)
      .subscribe(() => {
        this.recolecciones = this.recolecciones.filter(r => r.idRecoleccion !== id);
      });
  }

  cancelarRecoleccion(id: number) {
    this.recoleccionService.actualizarEstado(id, EstadoRecoleccion.Cancelada)
      .subscribe(() => {
        this.recolecciones = this.recolecciones.filter(r => r.idRecoleccion !== id);
      });
  }
}
