import { Component, OnInit } from '@angular/core';
import { UsuarioService } from '../../../Services/usuario.service';
import { UsuarioModel } from '../../../Models/usuario';
import { CommonModule } from '@angular/common';
import { Tabla, ColumnaTabla } from '../../../shared/tabla/tabla';
import { Modal } from '../../../shared/modal/modal';
import { LocalidadNombrePipe } from '../../../core/pipes/LocalidadNombrePipe';
@Component({
  selector: 'app-aceptar-rechazar-usuarios',
  standalone: true,
  imports: [CommonModule, Tabla, Modal, LocalidadNombrePipe],
  templateUrl: './aceptar-rechazar-usuarios.html',
  styleUrl: './aceptar-rechazar-usuarios.css',
})
export class AceptarRechazarUsuarios implements OnInit {

  usuariosPendientes: UsuarioModel[] = [];

  // columnas para el componente reutilizable
  columnas: ColumnaTabla[] = [
    { campo: 'nombre', titulo: 'Nombre' },
    { campo: 'correo', titulo: 'Correo' },
    { campo: 'cedula', titulo: 'Cédula' },
    { campo: 'localidad', titulo: 'Localidad' }
  ];

  // Modal
  modalAbierto: boolean = false;
  usuarioSeleccionado?: UsuarioModel;

  constructor(private usuarioService: UsuarioService) {}

  ngOnInit(): void {
    this.cargarUsuariosPendientes();
  }

  cargarUsuariosPendientes() {
    this.usuarioService.obtenerUsuariosPendientes().subscribe((usuarios) => {
      this.usuariosPendientes = usuarios;
    });
  }

  // Abrir modal
  verDetalle(usuario: UsuarioModel) {
    this.usuarioSeleccionado = usuario;
    this.modalAbierto = true;
  }

  // Acciones del admin
  aprobar(id: number | undefined) {
    if (!id) return;
    this.usuarioService.aprobarUsuario(id).subscribe(() => {
      this.modalAbierto = false;
      this.cargarUsuariosPendientes();
    });
  }

  rechazar(id: number | undefined) {
    if (!id) return;
    this.usuarioService.rechazarUsuario(id).subscribe(() => {
      this.modalAbierto = false;
      this.cargarUsuariosPendientes();
    });
  }

  cerrarModal() {
    this.modalAbierto = false;
  }
}
