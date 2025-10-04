import { Component, OnInit } from '@angular/core';
import { Service } from '../solcitudes/solcitudes/service';
import { ServiceModel, EstadoPeticion, Localidad } from '../solcitudes/solcitudes/model';
import { saveAs } from 'file-saver';

@Component({
  selector: 'app-solicitudes-export',
  templateUrl: './solicitudes-export.html',
  styleUrls: ['./solicitudes-export.css']
})
export class SolicitudesExportComponent implements OnInit {

  solicitudes: ServiceModel[] = [];
  estados = Object.values(EstadoPeticion);
  localidades = Object.values(Localidad);

  filtroEstado: EstadoPeticion | '' = '';
  filtroLocalidad: Localidad | '' = '';
  fechaDesde: string = '';
  fechaHasta: string = '';

  loading = false;

  constructor(private service: Service) { }

  ngOnInit(): void {
    this.listarSolicitudes();
  }

  // =============================
  // LISTADO
  // =============================
  listarSolicitudes(): void {
    this.loading = true;

    if (this.filtroEstado) {
      this.service.listarPorEstado(this.filtroEstado).subscribe({
        next: data => {
          this.solicitudes = data;
          this.loading = false;
        },
        error: err => {
          console.error('Error al filtrar por estado', err);
          this.loading = false;
        }
      });
    } else {
      this.service.listar().subscribe({
        next: data => {
          this.solicitudes = data;
          this.loading = false;
        },
        error: err => {
          console.error('Error al listar solicitudes', err);
          this.loading = false;
        }
      });
    }
  }

  // =============================
  // EXPORTACIÓN
  // =============================
  exportarExcel(): void {
    this.service.exportarExcel(
      this.filtroEstado || undefined,
      this.filtroLocalidad || undefined,
      this.fechaDesde || undefined,
      this.fechaHasta || undefined
    ).subscribe({
      next: blob => saveAs(blob, 'solicitudes.xlsx'),
      error: err => console.error('Error al exportar Excel', err)
    });
  }

  exportarPDF(): void {
    this.service.exportarPDF(
      this.filtroEstado || undefined,
      this.filtroLocalidad || undefined,
      this.fechaDesde || undefined,
      this.fechaHasta || undefined
    ).subscribe({
      next: blob => saveAs(blob, 'solicitudes.pdf'),
      error: err => console.error('Error al exportar PDF', err)
    });
  }

  // =============================
  // FILTROS
  // =============================
  aplicarFiltros(): void {
    this.listarSolicitudes();
  }
}
