import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Service } from '../../../Services/solicitud.service';
import { ServiceModel } from '../../../Models/solicitudes.model';
import { COMPARTIR_IMPORTS } from '../../../shared/imports';
import { Boton } from "../../../shared/botones/boton/boton";

@Component({
  selector: 'app-cards-solicitud',
  standalone: true,              // 👈 importante si estás usando standalone
  imports: [CommonModule, COMPARTIR_IMPORTS, Boton],       // 👈 aquí agregamos CommonModule para usar *ngFor y *ngIf
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
