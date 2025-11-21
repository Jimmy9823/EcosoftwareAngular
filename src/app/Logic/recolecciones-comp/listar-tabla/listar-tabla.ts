import { Component } from '@angular/core';
import { RecoleccionService } from '../../../Services/recoleccion.service';
import { ModeloRecoleccion } from '../../../Models/modelo-recoleccion';
import { COMPARTIR_IMPORTS } from '../../../shared/imports';
import { ColumnaTabla, Tabla } from '../../../shared/tabla/tabla';

@Component({
  selector: 'app-listar-tabla',
  imports: [COMPARTIR_IMPORTS, Tabla],
  templateUrl: './listar-tabla.html',
  styleUrl: './listar-tabla.css'
})
export class ListarTabla {
  columnas: ColumnaTabla[] = [
    { campo: 'idRecoleccion', titulo: 'ID' },
    { campo: 'solicitudId', titulo: 'Solicitud' },
    { campo: 'recolectorId', titulo: 'Recolector' },
    { campo: 'rutaId', titulo: 'Ruta' },
    { campo: 'estado', titulo: 'Estado' },
    { campo: 'fechaRecoleccion', titulo: 'Fecha Recolección' },
    { campo: 'observaciones', titulo: 'Observaciones' }
  ];

  

  data: ModeloRecoleccion[] = [];
  cargando = true;
  error = '';

  constructor(private recoleccionService: RecoleccionService) {}

  ngOnInit() {
    this.recoleccionService.listarActivas().subscribe({
      next: (res) => {
        this.data = res;
        this.cargando = false;
      },
      error: () => {
        this.error = 'Error al cargar las recolecciones activas';
        this.cargando = false;
      }
    });
  }

  ver(item: any) {
    console.log("VER:", item);
  }
  editar(item: any) {
    console.log("EDITAR:", item);
  }
  eliminar(item: any) {
    console.log("ELIMINAR:", item);
  }
}
