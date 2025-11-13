import { Component, OnInit } from '@angular/core';
import { COMPARTIR_IMPORTS } from '../../../shared/imports';
import { RecoleccionService } from '../../../Services/recoleccion.service';
import { ModeloRecoleccion, EstadoRecoleccion } from '../../../Models/modelo-recoleccion';

@Component({
  selector: 'app-cards-recoleccion-ciudadano',
  imports: [COMPARTIR_IMPORTS],
  templateUrl: './cards-recoleccion-ciudadano.html',
  styleUrl: './cards-recoleccion-ciudadano.css'
})
export class CardsRecoleccionCiudadano implements OnInit {

  recolecciones: ModeloRecoleccion[] = [];
  cargando = true;
  error = '';
  EstadoRecoleccion = EstadoRecoleccion;
  recoleccionSeleccionada: ModeloRecoleccion | null = null;
  fechaProgramadaEditable: string = '';
  estadoEditable: EstadoRecoleccion = EstadoRecoleccion.Pendiente;

  constructor(private recoleccionService: RecoleccionService) {}

  ngOnInit(): void {
    this.cargarMisRecolecciones();
  }

  cargarMisRecolecciones(): void {
    this.recoleccionService.listarActivas().subscribe({
      next: (data) => {
        this.recolecciones = data;
        this.cargando = false;
      },
      error: () => {
        this.error = 'Error al cargar mis recolecciones';
        this.cargando = false;
      }
    });
  }

  mostrarBotones(estado: string): boolean {
    return estado !== 'Completada' && estado !== 'Cancelada';
  }

  cancelarRecoleccion(id: number) {
    this.recoleccionService.actualizarEstado(id, EstadoRecoleccion.Cancelada)
      .subscribe(() => {
        this.recolecciones = this.recolecciones.filter(r => r.idRecoleccion !== id);
      });
  }

  abrirModalEdicion(reco: ModeloRecoleccion) {
    this.recoleccionSeleccionada = { ...reco }; // clonar

    // Cargar valores iniciales
    this.estadoEditable = reco.estado as EstadoRecoleccion;
    this.fechaProgramadaEditable = reco.fechaRecoleccion
      ? new Date(reco.fechaRecoleccion).toISOString().slice(0, 16)
      : '';

    const modal = document.getElementById('modalEdicion');
    if (modal) {
      const modalBootstrap = new (window as any).bootstrap.Modal(modal);
      modalBootstrap.show();
    }
  }

  guardarEdicion() {
  if (!this.recoleccionSeleccionada) return;

  this.recoleccionSeleccionada.estado = this.estadoEditable;

  // ✅ Convertimos el Date a string ISO (formato válido para backend)
  this.recoleccionSeleccionada.fechaRecoleccion = new Date(this.fechaProgramadaEditable).toISOString();

  this.recoleccionService.actualizarRecoleccion(
    this.recoleccionSeleccionada.idRecoleccion!,
    this.recoleccionSeleccionada
  ).subscribe({
    next: (actualizada) => {
      this.recolecciones = this.recolecciones.map(r =>
        r.idRecoleccion === actualizada.idRecoleccion ? actualizada : r
      );
      this.cerrarModal();
    },
    error: err => console.error('Error al actualizar', err)
  });
}

  cerrarModal() {
    const modal = document.getElementById('modalEdicion');
    if (modal) {
      const modalBootstrap = (window as any).bootstrap.Modal.getInstance(modal);
      if (modalBootstrap) {
        modalBootstrap.hide();
      }
    }
    this.recoleccionSeleccionada = null;
  }
}
