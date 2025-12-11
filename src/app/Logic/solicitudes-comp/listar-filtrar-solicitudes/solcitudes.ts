// solicitudes.component.ts
import { Component, OnInit, ViewChild } from '@angular/core';
import { Service } from '../../../Services/solicitud.service';
import { ServiceModel } from '../../../Models/solicitudes.model';
import { COMPARTIR_IMPORTS } from '../../../shared/imports';
import { ColumnaTabla, Tabla } from '../../../shared/tabla/tabla';
import { Modal } from "../../../shared/modal/modal";
import { Boton } from "../../../shared/botones/boton/boton";

@Component({
  selector: 'app-solcitudes',
  standalone: true,
  imports: [COMPARTIR_IMPORTS, Tabla, Modal, Boton],
  templateUrl: './solcitudes.html',
  styleUrls: ['./solcitudes.css']
})
export class Solcitudes implements OnInit {

  solicitudes: ServiceModel[] = [];
  selectedSolicitud: ServiceModel | null = null;
  motivoRechazo: string = '';
  selectedMotivo: string = '';
  motivosDisponibles: string[] = [
    'Datos incorrectos',
    'Solicitud duplicada',
    'Información incompleta',
    'No cumple requisitos',
    'Revisión administrativa'
  ];
  mostrarModalRechazo = false;
    @ViewChild('modalReportes') modalReportes!: Modal;


  // filtros
  estadoFilter: string = '';
  localidadFilter: string = '';
  fechaDesde: string = '';
  fechaHasta: string = '';

  cargandoExport = false;

  constructor(private solicitudesService: Service) {}

  // justo dentro de tu clase Solcitudes
columnasSolicitudes: ColumnaTabla[] = [
  { campo: 'idSolicitud', titulo: 'ID' },
  { campo: 'tipoResiduo', titulo: 'Tipo Residuo' },
  { campo: 'cantidad', titulo: 'Cantidad' },
  { campo: 'localidad', titulo: 'Localidad' },
  { campo: 'estadoPeticion', titulo: 'Estado' }
];

cellTemplates = {
  estadoPeticion: (item: ServiceModel): string => {
    const estado = item.estadoPeticion || '';
    let icon = '';
    let clase = '';

    switch (estado) {
      case 'Pendiente':
        icon = '<i class="bi bi-clock"></i>';
        clase = 'status-pendiente';
        break;
      case 'Aceptada':
        icon = '<i class="bi bi-check-circle"></i>';
        clase = 'status-aceptada';
        break;
      case 'Cancelada':
        icon = '<i class="bi bi-x-circle"></i>';
        clase = 'status-cancelada';
        break;
      case 'Rechazada':
        icon = '<i class="bi bi-slash-circle"></i>';
        clase = 'status-rechazada';
        break;
    }

    return `<span class="status-badge ${clase}">${icon} ${estado}</span>`;
  }
};






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

  // ===============================
  // MODALES
  // ===============================
  abrirModalReportes(): void {
    this.modalReportes.isOpen = true;
  }


  abrirModalRechazo(solicitud: ServiceModel): void {
    this.selectedSolicitud = solicitud;
    this.motivoRechazo = '';
    this.selectedMotivo = '';
    this.mostrarModalRechazo = true;
  }

  confirmarRechazo(): void {
    if (!this.selectedSolicitud) return;

    const motivoFinal = this.selectedMotivo;
    if (!motivoFinal || !motivoFinal.trim()) {
      alert('Seleccione un motivo de rechazo');
      return;
    }

    console.log('[confirmarRechazo] enviando rechazo:', { 
      id: this.selectedSolicitud.idSolicitud, 
      motivo: motivoFinal 
    });

    this.solicitudesService.rechazarSolicitud(this.selectedSolicitud.idSolicitud!, motivoFinal).subscribe({
      next: () => {
        alert(`Solicitud #${this.selectedSolicitud?.idSolicitud} rechazada correctamente`);
        this.cerrarModalRechazo();
        this.listarSolicitudes();
      },
      error: (err) => {
        console.error('❌ Error al rechazar la solicitud:', err);
        if (err.error) {
          console.error('Detalle del error:', err.error);
        }
        alert(`Error al rechazar: ${err.message || err.statusText}`);
      }
    });
  }

  cerrarModalRechazo(): void {
    this.selectedSolicitud = null;
    this.motivoRechazo = '';
    this.mostrarModalRechazo = false;
  }

  // ===============================
  // BOTONES MODALES
  // ===============================
  botonesReporte = [
    {
      texto: 'PDF',
      icono: 'bi-file-earmark-pdf',
      color: 'outline-custom-danger',
      accion: () => this.exportarPDF()
    },
    {
      texto: 'Excel',
      icono: 'bi-file-earmark-excel',
      color: 'outline-custom-success',
      accion: () => this.exportarExcel()
    }
  ];

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

  abrirModalEdicion(solicitud: ServiceModel): void {
    console.log('✏️ Editar solicitud:', solicitud);
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