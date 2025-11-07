import { Component, OnInit } from '@angular/core';
import { CapacitacionesService } from '../../../Services/capacitacion.service';
import { Capacitacion } from '../../../Models/capacitacion.model';
import { COMPARTIR_IMPORTS } from '../../../ImpCondYForms/imports';
import { Tabla } from '../../../shared/tabla/tabla';

@Component({
  selector: 'app-listar-capacitaciones',
  standalone: true,
  imports: [COMPARTIR_IMPORTS, Tabla],
  templateUrl: './listar-capacitaciones.html',
  styleUrl: './listar-capacitaciones.css'
})
export class CapacitacionesLista implements OnInit {

  // ✅ Configuración de columnas para app-tabla
  columns = [
    { key: 'id', label: 'ID' },
    { key: 'titulo', label: 'Título' },
    { key: 'descripcion', label: 'Descripción' },
    { key: 'fechaInicio', label: 'Inicio' },
    { key: 'fechaFin', label: 'Fin' },
    { key: 'lugar', label: 'Lugar' }
  ];

  // ✅ Datos recibidos del backend
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
}
