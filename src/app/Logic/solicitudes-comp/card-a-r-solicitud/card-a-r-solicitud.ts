import { Component, OnInit, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Service } from '../../../Services/solicitud.service';
import { ServiceModel } from '../../../Models/solicitudes.model';
import { UsuarioService } from '../../../Services/usuario.service';

@Component({
  selector: 'app-card-a-r-solicitud',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './card-a-r-solicitud.html',
  styleUrls: ['./card-a-r-solicitud.css']
})
export class CardARSolicitud implements OnInit {

  @Input() solicitudes: ServiceModel[] = [];

  idRecolector: number = 3 ; //puede ser id 3 o 4
  motivoRechazo: string = '';
u: any;


  constructor(private service: Service) {}

  ngOnInit(): void {
    if (!this.solicitudes || this.solicitudes.length === 0) {
      this.cargarSolicitudesPendientes();
    }
  }

  // 🔥 SOLO SOLICITUDES PENDIENTES
  cargarSolicitudesPendientes(): void {
    this.service.listarPorEstado('Pendiente').subscribe({
      next: (data) => {
        this.solicitudes = data;
      },
      error: (err) => console.error('Error al cargar solicitudes pendientes', err)
    });
  }

  aceptarSolicitud(solicitud: ServiceModel): void {
    this.service.aceptarSolicitud(solicitud.idSolicitud!).subscribe({
      next: () => {
        alert(`✅ Solicitud #${solicitud.idSolicitud} aceptada correctamente`);
        this.cargarSolicitudesPendientes();
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
          this.cargarSolicitudesPendientes();
        },
        error: (err) => console.error('Error al rechazar la solicitud', err)
      });
    }
  }

  editar(s: any) {
    console.log('EDITAR', s);
  }

  ver(s: any) {
    console.log('VER', s);
  }
}
