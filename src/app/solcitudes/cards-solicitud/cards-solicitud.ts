import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Service } from '../../Services/solicitud.service';
import { ServiceModel } from '../../Models/model';

@Component({
  selector: 'app-cards-solicitud',
  standalone: true,              // 👈 importante si estás usando standalone
  imports: [CommonModule],       // 👈 aquí agregamos CommonModule para usar *ngFor y *ngIf
  templateUrl: './cards-solicitud.html',
  styleUrls: ['./cards-solicitud.css']
})
export class CardsSolicitud implements OnInit {

  solicitudes: ServiceModel[] = [];
  idCiudadano: number = 2;

  constructor(private service: Service) {}

  ngOnInit(): void {
    this.cargarSolicitudes();
  }

  cargarSolicitudes(): void {
    this.service.listar().subscribe({
      next: (data) => {
        this.solicitudes = data.map(s => ({
          ...s,
          idUsuario: this.idCiudadano
        }));
      },
      error: (err) => {
        console.error('Error al cargar solicitudes:', err);
      }
    });
  }
}
