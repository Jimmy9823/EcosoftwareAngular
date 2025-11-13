import { Component } from '@angular/core';
import { RecoleccionService } from '../../../Services/recoleccion.service';
import { ModeloRecoleccion } from '../../../Models/modelo-recoleccion';
import { COMPARTIR_IMPORTS } from '../../../shared/imports';
import { Tabla } from '../../../shared/tabla/tabla';

@Component({
  selector: 'app-listar-tabla',
  imports: [COMPARTIR_IMPORTS, Tabla],
  templateUrl: './listar-tabla.html',
  styleUrl: './listar-tabla.css'
})
export class ListarTabla {
  columnas = [
    { key: 'idRecoleccion', label: 'ID' },
    { key: 'solicitudId', label: 'Solicitud' },
    { key: 'recolectorId', label: 'Recolector' },
    { key: 'rutaId', label: 'Ruta' },
    { key: 'estado', label: 'Estado' },
    { key: 'fechaRecoleccion', label: 'Fecha Recolección' },
    { key: 'observaciones', label: 'Observaciones' }
  ];

  datos: ModeloRecoleccion[] = [];
  cargando = true;
  error = '';

  constructor(private recoleccionService: RecoleccionService) {}

  ngOnInit() {
    this.recoleccionService.listarActivas().subscribe({
      next: (res) => {
        this.datos = res;
        this.cargando = false;
      },
      error: () => {
        this.error = 'Error al cargar las recolecciones activas';
        this.cargando = false;
      }
    });
  }
}
