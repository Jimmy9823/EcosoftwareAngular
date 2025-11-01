import { Component, OnInit } from '@angular/core';
import { CapacitacionesService } from '../../../Services/capacitacion.service';
import { Capacitacion } from '../../../Models/capacitacion.model';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-card-crud-capacitacion',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './card-crud-capacitacion.html',
  styleUrls: ['./card-crud-capacitacion.css']
})
export class CapacitacionesCrudComponent implements OnInit {

  // 📌 Lista de capacitaciones
  capacitaciones: Capacitacion[] = [];

  // 📌 Modal de creación / edición
  mostrarModal = false;
  esEdicion = false;

  // 📌 Objeto editable
  capacitacionForm: Capacitacion = {
    nombre: '',
    descripcion: '',
    numeroDeClases: '',
    duracion: ''
  };

  constructor(private capacitacionesService: CapacitacionesService) {}

  ngOnInit(): void {
    this.obtenerCapacitaciones();
  }

  obtenerCapacitaciones(): void {
    this.capacitacionesService.listarTodasCapacitaciones().subscribe({
      next: data => this.capacitaciones = data,
      error: err => console.error('Error al obtener capacitaciones', err)
    });
  }

  // ✅ Abrir formulario para crear
  abrirCrear(): void {
    this.esEdicion = false;
    this.mostrarModal = true;
    this.capacitacionForm = {
      nombre: '',
      descripcion: '',
      numeroDeClases: '',
      duracion: ''
    };
  }

  // ✅ Abrir formulario para editar
  abrirEditar(capacitacion: Capacitacion): void {
    this.esEdicion = true;
    this.mostrarModal = true;
    this.capacitacionForm = { ...capacitacion };
  }

  // ✅ Guardar (crear o editar)
  guardarCapacitacion(): void {
    if (this.esEdicion && this.capacitacionForm.id) {
      this.capacitacionesService.actualizarCapacitacion(this.capacitacionForm.id, this.capacitacionForm)
        .subscribe(() => {
          this.mostrarModal = false;
          this.obtenerCapacitaciones();
        });
    } else {
      this.capacitacionesService.crearCapacitacion(this.capacitacionForm)
        .subscribe(() => {
          this.mostrarModal = false;
          this.obtenerCapacitaciones();
        });
    }
  }

  // ✅ Eliminar
  eliminarCapacitacion(id?: number): void {
    if (!id) return;
    if (confirm('¿Seguro que deseas eliminar esta capacitación?')) {
      this.capacitacionesService.eliminarCapacitacion(id).subscribe(() => {
        this.obtenerCapacitaciones();
      });
    }
  }
}
