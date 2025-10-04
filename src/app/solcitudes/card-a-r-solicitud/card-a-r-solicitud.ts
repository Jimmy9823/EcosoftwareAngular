import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Service } from '../solcitudes/solicitudes/service';
import { ServiceModel } from '../solcitudes/model';

@Component({
  selector: 'app-card-a-r-solicitud',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './card-a-r-solicitud.html',
  styleUrls: ['./card-a-r-solicitud.css']
})
export class CardARSolicitud implements OnInit {

  solicitudes: ServiceModel[] = [];
  idRecolector: number = 3; // ⚠️ Simulación: ID fijo del recolector logueado
  motivoRechazo: string = '';

  constructor(private service: Service) {}

  ngOnInit(): void {
    this.cargarSolicitudes();
  }

  cargarSolicitudes(): void {
    this.service.listar().subscribe({
      next: (data) => {
        this.solicitudes = data;
      },
      error: (err) => console.error('Error al cargar solicitudes', err)
    });
  }

  aceptarSolicitud(solicitud: ServiceModel): void {
    this.service.aceptarSolicitud(solicitud.idSolicitud!, solicitud, this.idRecolector).subscribe({
      next: () => {
        alert(`✅ Solicitud #${solicitud.idSolicitud} aceptada correctamente`);
        this.cargarSolicitudes();
      },
      error: (err) => console.error('Error al aceptar la solicitud', err)
    });
  }

  rechazarSolicitud(solicitud: ServiceModel): void {
    const motivo = prompt(`Ingrese el motivo de rechazo para la solicitud #${solicitud.idSolicitud}:`);
    if (motivo && motivo.trim().length > 0) {
      this.service.rechazarSolicitud(solicitud.idSolicitud!, motivo).subscribe({
        next: () => {
          alert(`❌ Solicitud #${solicitud.idSolicitud} rechazada`);
          this.cargarSolicitudes();
        },
        error: (err) => console.error('Error al rechazar la solicitud', err)
      });
    }
  }
}
