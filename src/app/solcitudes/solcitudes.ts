import { Component, OnInit } from '@angular/core';
import { Service } from './solcitudes/service';
import { ServiceModel } from './solcitudes/model';
import { COMPARTIR_IMPORTS } from '../ImpCondYForms/imports';

@Component({
  selector: 'app-solcitudes',
  standalone: true,
  imports: [COMPARTIR_IMPORTS],
  templateUrl: './solcitudes.html',
  styleUrls: ['./solcitudes.css']
})
export class Solcitudes implements OnInit {

  solicitudes: ServiceModel[] = [];
  selectedSolicitud: ServiceModel | null = null;
  motivoRechazo: string = '';
  mostrarModalRechazo = false;

  constructor(private solicitudesService: Service) {}

  ngOnInit(): void { 
    this.listarSolicitudes();
  }

  listarSolicitudes(): void {
    this.solicitudesService.listar().subscribe({
      next: (lista: ServiceModel[]) => {
        this.solicitudes = lista;
      },
      error: (err) => console.error('❌ Error al listar solicitudes', err)
    });
  }

  aceptarSolicitud(solicitud: ServiceModel): void {
    const recolectorId = 3; // ⚠️ Cambiar por el ID real del recolector desde la sesión
    this.solicitudesService.aceptarSolicitud(solicitud.idSolicitud!, solicitud, recolectorId).subscribe({
      next: () => {
        alert(`Solicitud #${solicitud.idSolicitud} aceptada correctamente ✅`);
        this.listarSolicitudes();
      },
      error: (err) => console.error('❌ Error al aceptar la solicitud', err)
    });
  }

  abrirModalRechazo(solicitud: ServiceModel): void {
    this.selectedSolicitud = solicitud;
    this.motivoRechazo = '';
    this.mostrarModalRechazo = true;
  }

  confirmarRechazo(): void {
    if (!this.selectedSolicitud) return;

    this.solicitudesService.rechazarSolicitud(this.selectedSolicitud.idSolicitud!, this.motivoRechazo).subscribe({
      next: () => {
        alert(`Solicitud #${this.selectedSolicitud?.idSolicitud} rechazada correctamente ❌`);
        this.cerrarModalRechazo();
        this.listarSolicitudes();
      },
      error: (err) => console.error('❌ Error al rechazar la solicitud', err)
    });
  }

  cerrarModalRechazo(): void {
    this.selectedSolicitud = null;
    this.motivoRechazo = '';
    this.mostrarModalRechazo = false;
  }
}
