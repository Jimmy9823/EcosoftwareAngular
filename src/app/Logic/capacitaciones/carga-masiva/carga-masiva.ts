import { Component } from '@angular/core';
import { CapacitacionesService } from '../../../Services/capacitacion.service';
import { COMPARTIR_IMPORTS } from '../../../ImpCondYForms/imports';

@Component({
  selector: 'app-carga-masiva-capacitacion',
  templateUrl: './carga-masiva.html',
  styleUrls: ['./carga-masiva.css'], 
  imports: [COMPARTIR_IMPORTS]
})
export class CapacitacionExcelComponent {

  archivoSeleccionado: File | null = null;
  mensaje: string = '';

  constructor(private capacitacionesService: CapacitacionesService) {}

  // ✅ Capturar archivo seleccionado
  onFileSelected(event: any): void {
    this.archivoSeleccionado = event.target.files[0];
  }

  // ✅ Subir y cargar Excel en backend
  cargarExcel(): void {
    if (!this.archivoSeleccionado) {
      this.mensaje = 'Por favor seleccione un archivo Excel.';
      return;
    }

    this.capacitacionesService.cargarCapacitacionesDesdeExcel(this.archivoSeleccionado)
      .subscribe({
        next: (respuesta) => {
          this.mensaje = '✅ Archivo cargado correctamente: ' + respuesta;
        },
        error: (err) => {
          this.mensaje = '❌ Error al cargar el archivo.';
          console.error(err);
        }
      });
  }

  // ✅ Descargar plantilla Excel
  descargarPlantilla(): void {
    this.capacitacionesService.generarPlantillaExcel().subscribe({
      next: (blob) => {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'plantilla_capacitaciones.xlsx';
        a.click();
        window.URL.revokeObjectURL(url);
        this.mensaje = '✅ Plantilla descargada correctamente.';
      },
      error: (err) => {
        this.mensaje = '❌ Error al descargar la plantilla.';
        console.error(err);
      }
    });
  }
}

