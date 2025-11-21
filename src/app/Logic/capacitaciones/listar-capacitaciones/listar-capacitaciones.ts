import { Component, OnInit } from '@angular/core';
import { CapacitacionesService } from '../../../Services/capacitacion.service';
import { Capacitacion } from '../../../Models/capacitacion.model';
import { COMPARTIR_IMPORTS } from '../../../shared/imports';
import { Tabla, ColumnaTabla } from '../../../shared/tabla/tabla';

@Component({
  selector: 'app-listar-capacitaciones',
  standalone: true,
  imports: [COMPARTIR_IMPORTS, Tabla],
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

  ver(item: any) {
    console.log("VER:", item);
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
