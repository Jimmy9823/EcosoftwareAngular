import { Component, OnInit, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Service } from '../../../Services/solicitud.service';
import { ServiceModel } from '../../../Models/solicitudes.model';
import { UsuarioService } from '../../../Services/usuario.service';

@Component({
  selector: 'app-card-a-r-solicitud',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './card-a-r-solicitud.html',
  styleUrls: ['./card-a-r-solicitud.css']
})
export class CardARSolicitud implements OnInit {

  @Input() solicitudes: ServiceModel[] = [];

  idRecolector: number = 3 ; //puede ser id 3 o 4
  motivoRechazo: string = '';
u: any;
  motivosDisponibles: string[] = [
    'Datos incorrectos',
    'Solicitud duplicada',
    'Información incompleta',
    'No cumple requisitos',
    'Revisión administrativa'
  ];
  selectedMotivos: { [id: number]: string } = {};


  constructor(private service: Service) {}

  getSelectedMotivo(id: number | undefined): string {
    if (!id) return '';
    return this.selectedMotivos[id] || '';
  }

  setSelectedMotivo(id: number | undefined, value: string) {
    if (!id) return;
    this.selectedMotivos[id] = value;
  }

  ngOnInit(): void {
    if (!this.solicitudes || this.solicitudes.length === 0) {
      this.cargarSolicitudesPendientes();
    }
  }

  //  SOLO SOLICITUDES PENDIENTES
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
        alert(` Solicitud #${solicitud.idSolicitud} aceptada correctamente`);
        this.cargarSolicitudesPendientes();
      },
      error: (err) => console.error('Error al aceptar la solicitud', err)
    });
  }

  rechazarSolicitud(solicitud: ServiceModel): void {
    const id = solicitud.idSolicitud!;
    const motivoFinal = this.selectedMotivos[id];
    if (!motivoFinal || !motivoFinal.trim()) {
      alert('Seleccione un motivo de rechazo antes de continuar.');
      return;
    }

    this.service.rechazarSolicitud(id, motivoFinal).subscribe({
      next: () => {
        alert(` Solicitud #${id} rechazada`);
        // limpiar selección
        delete this.selectedMotivos[id];
        
        this.cargarSolicitudesPendientes();
      },
      error: (err) => {
        console.error('Error al rechazar la solicitud:', err);
        if (err.error) {
          console.error('Detalle del error:', err.error);
        }
        alert(`Error al rechazar: ${err.message || err.statusText}`);
      }
    });
  }

  editar(s: any) {
    console.log('EDITAR', s);
  }

  ver(s: any) {
    console.log('VER', s);
  }
}
