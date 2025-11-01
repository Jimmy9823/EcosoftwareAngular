// solicitudes.component.ts
import { Component, OnInit } from '@angular/core';
import { Service } from '../Services/solicitud.service';
import { ServiceModel } from '../Models/model';
import { COMPARTIR_IMPORTS } from '../ImpCondYForms/imports';

@Component({
  selector: 'app-solcitudes',
  standalone: true,
  imports: [COMPARTIR_IMPORTS],
  templateUrl: './solcitudes.html',
  styleUrls: ['./solcitudes.css']
})
export class Solcitudes implements OnInit {

  solicitudes: ServiceModel[] = [];
  selectedSolicitud: ServiceModel | null = null;
  motivoRechazo: string = '';
  mostrarModalRechazo = false;

  // filtros
  estadoFilter: string = '';
  localidadFilter: string = '';
  fechaDesde: string = '';
  fechaHasta: string = '';

  cargandoExport = false;

  constructor(private solicitudesService: Service) {}

  ngOnInit(): void { 
    this.listarSolicitudes();
  }

  listarSolicitudes(): void {
    this.solicitudesService.listar().subscribe({
      next: (lista: ServiceModel[]) => this.solicitudes = lista || [],
      error: (err) => console.error('❌ Error al listar solicitudes', err)
    });
  }

  aceptarSolicitud(solicitud: ServiceModel): void {
    const recolectorId = 3; // Cambiar por ID real desde sesión
    this.solicitudesService.aceptarSolicitud(solicitud.idSolicitud!).subscribe({
      next: () => {
        alert(`Solicitud #${solicitud.idSolicitud} aceptada correctamente ✅`);
        this.listarSolicitudes();
      },
      error: (err) => console.error('❌ Error al aceptar solicitud', err)
    });
  }

  abrirModalRechazo(solicitud: ServiceModel): void {
    this.selectedSolicitud = solicitud;
    this.motivoRechazo = '';
    this.mostrarModalRechazo = true;
  }

  confirmarRechazo(): void {
    if (!this.selectedSolicitud) return;

    this.solicitudesService.rechazarSolicitud(this.selectedSolicitud.idSolicitud!, this.motivoRechazo).subscribe({
      next: () => {
        alert(`Solicitud #${this.selectedSolicitud?.idSolicitud} rechazada correctamente`);
        this.cerrarModalRechazo();
        this.listarSolicitudes();
      },
      error: (err) => console.error('❌ Error al rechazar la solicitud', err)
    });
  }

  cerrarModalRechazo(): void {
    this.selectedSolicitud = null;
    this.motivoRechazo = '';
    this.mostrarModalRechazo = false;
  }

  // ========================
  // FILTROS
  // ========================
  aplicarFiltros(): void {
    this.solicitudesService.listar().subscribe({
      next: (lista: ServiceModel[]) => {
        let resultados = lista || [];
        if (this.estadoFilter) resultados = resultados.filter(r => r.estadoPeticion === this.estadoFilter);
        if (this.localidadFilter) {
          const loc = this.localidadFilter.trim().toLowerCase();
          resultados = resultados.filter(r => (r.localidad || '').toLowerCase().includes(loc));
        }
        if (this.fechaDesde) {
          const desde = new Date(this.fechaDesde);
          resultados = resultados.filter(r => r.fechaCreacionSolicitud ? new Date(r.fechaCreacionSolicitud) >= desde : false);
        }
        if (this.fechaHasta) {
          const hasta = new Date(this.fechaHasta);
          hasta.setHours(23,59,59,999);
          resultados = resultados.filter(r => r.fechaCreacionSolicitud ? new Date(r.fechaCreacionSolicitud) <= hasta : false);
        }
        this.solicitudes = resultados;
      },
      error: (err) => console.error(err)
    });
  }

  limpiarFiltros(): void {
    this.estadoFilter = '';
    this.localidadFilter = '';
    this.fechaDesde = '';
    this.fechaHasta = '';
    this.listarSolicitudes();
  }

  // ========================
  // EXPORTACIONES
  // ========================
  exportarExcel(): void {
    this.cargandoExport = true;
    this.solicitudesService.exportarExcel(
      this.estadoFilter || undefined,
      this.localidadFilter || undefined,
      this.fechaDesde || undefined,
      this.fechaHasta || undefined
    ).subscribe({
      next: (blob) => {
        this.downloadBlob(blob, `solicitudes_${this.timestamp()}.xlsx`);
        this.cargandoExport = false;
      },
      error: (err) => { console.error('❌ Error exportando Excel', err); this.cargandoExport = false; }
    });
  }

  exportarPDF(): void {
    this.cargandoExport = true;
    this.solicitudesService.exportarPDF(
      this.estadoFilter || undefined,
      this.localidadFilter || undefined,
      this.fechaDesde || undefined,
      this.fechaHasta || undefined
    ).subscribe({
      next: (blob) => {
        this.downloadBlob(blob, `solicitudes_${this.timestamp()}.pdf`);
        this.cargandoExport = false;
      },
      error: (err) => { console.error('❌ Error exportando PDF', err); this.cargandoExport = false; }
    });
  }

  private downloadBlob(blob: Blob, filename: string) {
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    a.remove();
    window.URL.revokeObjectURL(url);
  }

  private timestamp(): string {
    const d = new Date();
    return `${d.getFullYear()}${(d.getMonth()+1).toString().padStart(2,'0')}${d.getDate().toString().padStart(2,'0')}_${d.getHours().toString().padStart(2,'0')}${d.getMinutes().toString().padStart(2,'0')}`;
  }
}