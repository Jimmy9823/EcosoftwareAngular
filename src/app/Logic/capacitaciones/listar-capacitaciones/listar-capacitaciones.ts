import { Component, OnInit, ViewChild } from '@angular/core';
import { CapacitacionesService } from '../../../Services/capacitacion.service';
import { Capacitacion } from '../../../Models/capacitacion.model';
import { COMPARTIR_IMPORTS } from '../../../shared/imports';
import { Tabla, ColumnaTabla } from '../../../shared/tabla/tabla';
import { Modal } from '../../../shared/modal/modal';

@Component({
  selector: 'app-listar-capacitaciones',
  standalone: true,
  imports: [COMPARTIR_IMPORTS, Tabla,Modal],
  templateUrl: './listar-capacitaciones.html',
  styleUrl: './listar-capacitaciones.css'
})
export class CapacitacionesLista implements OnInit {

  columnas: ColumnaTabla[] = [
    { campo: 'id', titulo: 'ID' },
    { campo: 'nombre', titulo: 'Título' },
    { campo: 'descripcion', titulo: 'Descripción' },
    { campo: 'numeroDeClases', titulo: '# Clases' },
    { campo: 'duracion', titulo: 'Duración' },
  ];

  data: Capacitacion[] = [];

  cargando = true;
  error = '';
    @ViewChild('modalVerCapacitacion') modalVerCapacitacion!: Modal;
  selectedCapacitacion: Capacitacion | undefined;

  constructor(private capacitacionesService: CapacitacionesService) {}

  ngOnInit(): void {
    this.cargarCapacitaciones();
  }


  cargarCapacitaciones(): void {
    this.capacitacionesService.listarTodasCapacitaciones().subscribe({
      next: (capacitaciones) => {
        this.data = capacitaciones;
        this.cargando = false;
      },
      error: () => {
        this.error = 'Error al cargar capacitaciones';
        this.cargando = false;
      }
    });
  }
  // 🔵 EVENTOS DEL COMPONENTE ---------------------

 abrirModalVerCapacitacion(capacitacion: Capacitacion) {
  this.selectedCapacitacion = capacitacion;
  this.modalVerCapacitacion.isOpen = true;
}

  editar(item: any) {
    console.log("EDITAR:", item);
  }

  eliminar(item: any) {
    console.log("ELIMINAR:", item);
  }

  crear() {
    console.log("NUEVA CAPACITACION");
  }

  exportarCapacitaciones() {
    console.log("EXPORTAR");
  }
}
