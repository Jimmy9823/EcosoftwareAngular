import { ServiceModel } from './solicitudes/model';
import { Service } from './solicitudes/service';
import { Component, OnInit } from '@angular/core';
import { COMPARTIR_IMPORTS } from '../ImpCondYForms/imports';
import { Header } from '../shared/header/header';

@Component({
  selector: 'app-solcitudes',
  imports: [COMPARTIR_IMPORTS, Header],
  templateUrl: './solcitudes.html',
  styleUrl: './solcitudes.css'
})
export class Solcitudes implements OnInit {

  Servicios: ServiceModel[] = [];
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
        this.Servicios = lista;
      },
      error: (err) => console.error('Error al listar solicitudes', err)
    });
  }

  aceptarSolicitud(solicitud: ServiceModel): void {
    const recolectorId = 3; // ⚠️ Aquí deberías usar el ID real del recolector (por sesión o similar)
    this.solicitudesService.aceptarSolicitud(solicitud.idSolicitud, solicitud, recolectorId).subscribe({
      next: () => {
        alert(`Solicitud #${solicitud.idSolicitud} aceptada correctamente ✅`);
        this.listarSolicitudes(); // refrescar tabla
      },
      error: (err) => console.error('Error al aceptar la solicitud', err)
    });
  }

  abrirModalRechazo(solicitud: ServiceModel): void {
    this.selectedSolicitud = solicitud;
    this.motivoRechazo = '';
    this.mostrarModalRechazo = true;
  }

  confirmarRechazo(): void {
    if (!this.selectedSolicitud) return;

    const solicitud = {
      ...this.selectedSolicitud,
      motivo: this.motivoRechazo
    };

    this.solicitudesService.rechazarSolicitud(this.selectedSolicitud.idSolicitud, solicitud).subscribe({
      next: () => {
        alert(`Solicitud #${this.selectedSolicitud?.idSolicitud} rechazada correctamente ❌`);
        this.cerrarModalRechazo();
        this.listarSolicitudes();
      },
      error: (err) => console.error('Error al rechazar la solicitud', err)
    });
  }

  cerrarModalRechazo(): void {
    this.selectedSolicitud = null;
    this.motivoRechazo = '';
    this.mostrarModalRechazo = false;
  }
}
