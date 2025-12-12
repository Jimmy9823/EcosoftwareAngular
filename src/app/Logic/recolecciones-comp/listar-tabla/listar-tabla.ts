import { Component, ViewChild } from '@angular/core';
import { RecoleccionService } from '../../../Services/recoleccion.service';
import { ModeloRecoleccion } from '../../../Models/modelo-recoleccion';
import { COMPARTIR_IMPORTS } from '../../../shared/imports';
import { ColumnaTabla, Tabla } from '../../../shared/tabla/tabla';
import { Modal } from '../../../shared/modal/modal';

@Component({
  selector: 'app-listar-tabla',
  imports: [COMPARTIR_IMPORTS, Tabla, Modal],
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

  @ViewChild('modalVerRecoleccion') modalVerRecoleccion!: Modal;
  selectedRecoleccion: ModeloRecoleccion | null = null;

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

  ver(item: ModeloRecoleccion) {
    this.selectedRecoleccion = item;
    this.modalVerRecoleccion.isOpen = true;
  }

  editar(item: any) {
    console.log("EDITAR:", item);
  }

  eliminar(item: any) {
    console.log("ELIMINAR:", item);
  }
}
