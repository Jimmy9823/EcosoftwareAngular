import { Component, OnInit, ViewChild } from '@angular/core';
import { UsuarioService } from '../../../Services/usuario.service';
import { UsuarioModel } from '../../../Models/usuario';
import { COMPARTIR_IMPORTS } from '../../../shared/imports';
import { ColumnaTabla, Tabla } from '../../../shared/tabla/tabla';
import { Boton } from '../../../shared/botones/boton/boton';
import { Modal } from '../../../shared/modal/modal';

@Component({
  selector: 'app-usuario-tabla',
  templateUrl: './usuario.html',
  styleUrls: ['./usuario.css'],
  imports: [COMPARTIR_IMPORTS, Tabla, Boton, Modal],
})
export class Usuario implements OnInit {

  usuarios: UsuarioModel[] = [];
  cargando = false;

  editandoId: number | null = null;
  usuarioEditado: Partial<UsuarioModel> = {};

  mensaje = '';
  error = '';

  @ViewChild('modalReportes') modalReportes!: Modal;
  @ViewChild('modalEliminar') modalEliminar!: Modal;
  @ViewChild('modalEliminarFisico') modalEliminarFisico!: Modal;


  usuarioSeleccionado?: UsuarioModel | null = null;

  // Filtros
  criterioSeleccionado = 'nombre';
  filtroNombre = '';
  filtroCorreo = '';
  filtroDocumento = '';

  // Roles
  roles = [
    { id: 1, nombre: 'Administrador' },
    { id: 2, nombre: 'Ciudadano' },
    { id: 3, nombre: 'Empresa' },
    { id: 4, nombre: 'Reciclador' }
  ];

  columnasUsuarios: ColumnaTabla[] = [
    { campo: 'idUsuario', titulo: 'ID' },
    { campo: 'nombre', titulo: 'Nombre' },
    { campo: 'correo', titulo: 'Correo' },
    { campo: 'telefono', titulo: 'Teléfono' },
    { campo: 'rolId', titulo: 'Rol' },
    { campo: 'estado', titulo: 'Estado' }
  ];

  cellTemplatesUsuarios = {
    rolId: (u: UsuarioModel) => this.obtenerNombreRol(u.rolId),
    estado: (u: UsuarioModel) => {
      const clase = u.estado ? 'activo' : 'inactivo';
      const texto = u.estado ? 'Activo' : 'Inactivo';
      return `<span class="${clase}">${texto}</span>`;
    }
  };

  // ===============================
  // BOTONES DEL MODAL DE REPORTES
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

  // ===============================
  // BOTONES DEL MODAL DE ACTIVAR
  // ===============================
 accionesEliminar = [
  {
    texto: 'Inactivar',
    icono: 'bi-pause-circle', // Icono para inactivar
    color: 'warning',
    accion: () => this.inactivarUsuario()
  },
  {
    texto: 'Eliminar',
    icono: 'bi-trash',
    color: 'danger',
    accion: () => this.confirmarEliminacionFisica()
  }
];

  // ===============================
  // BOTONES DEL MODAL DE ELIMINAR
  // ===============================
accionesEliminarFisico = [
  {
    texto: 'Cancelar',
    icono: 'bi-x-circle',
    color: 'cancelar',
    hover: 'btn-cancelar',
    accion: () => this.cerrarModalEliminar()
  },
  {
    texto: 'Eliminar',
    icono: 'bi-trash',
    color: 'pastel-danger',
    hover: 'btn-pastel-danger',

    accion: () => this.confirmarEliminacionFisica()
  }
];



  constructor(private usuarioService: UsuarioService) {}

  ngOnInit(): void {
    this.cargarUsuarios();
  }

  // ===============================
  // MODAL ELIMINAR
  // ===============================

  abrirModalReportes(): void {
  this.modalReportes.isOpen = true;
}

  abrirModalEliminar(usuario: UsuarioModel): void {
    this.usuarioSeleccionado = usuario;
    this.modalEliminar.isOpen = true;
  }

  

  confirmarEliminacion(): void {
    if (!this.usuarioSeleccionado?.idUsuario) return;

    this.eliminarUsuario(this.usuarioSeleccionado.idUsuario);
    this.cerrarModalEliminar();
  }
abrirModalEliminarFisico(usuario: UsuarioModel): void {
  this.usuarioSeleccionado = usuario;
  this.modalEliminarFisico.isOpen = true;
}

cerrarModalEliminar(): void {
  this.modalEliminar.close();
  this.usuarioSeleccionado = null;
}

confirmarEliminacionFisica(): void {
  if (!this.usuarioSeleccionado?.idUsuario) return;

  this.usuarioService.eliminarFisico(this.usuarioSeleccionado.idUsuario).subscribe({
    next: () => {
      this.mensaje =  'Usuario eliminado permanentemente';
      this.cargarUsuarios();
      this.cerrarModalEliminar();

      setTimeout(() => (this.mensaje = ''), 2500);
    },
    error: () => {
      this.error = 'Error al eliminar el usuario';
      setTimeout(() => (this.error = ''), 2500);
    }
  });
}




  
inactivarUsuario(): void {
  if (!this.usuarioSeleccionado?.idUsuario) return;

  this.usuarioService.eliminarLogico(this.usuarioSeleccionado.idUsuario).subscribe({
    next: () => {
      this.mensaje = 'Usuario inactivado correctamente';
      this.cargarUsuarios();
      this.cerrarModalEliminar();
      setTimeout(() => (this.mensaje = ''), 2500);
    },
    error: () => {
      this.error = 'Error al inactivar el usuario';
      setTimeout(() => (this.error = ''), 2500);
    }
  });
}
  

  // ===============================
  // CARGAR USUARIOS
  // ===============================
  cargarUsuarios(): void {
    this.cargando = true;

    this.usuarioService.listar().subscribe({
      next: (data) => {
        this.usuarios = data;
        this.cargando = false;
      },
      error: () => {
        this.error = 'Error al cargar usuarios';
        this.cargando = false;
        setTimeout(() => (this.error = ''), 2500);
      }
    });
  }

  // ===============================
  // FILTROS
  // ===============================
  aplicarFiltroDesdeForm(): void {
    const valor = {
      nombre: this.filtroNombre,
      correo: this.filtroCorreo,
      documento: this.filtroDocumento
    }[this.criterioSeleccionado];

    if (!valor?.trim()) {
      this.cargarUsuarios();
      return;
    }

    this.cargando = true;

    this.usuarioService.filtrar(this.criterioSeleccionado, valor).subscribe({
      next: (usuariosFiltrados) => {
        this.usuarios = usuariosFiltrados;
        this.mensaje = `${usuariosFiltrados.length} usuario(s) encontrado(s)`;
        this.cargando = false;
        setTimeout(() => (this.mensaje = ''), 2500);
      },
      error: () => {
        this.error = 'Error al filtrar usuarios';
        this.cargando = false;
        setTimeout(() => (this.error = ''), 2500);
      }
    });
  }

  limpiarFiltro(): void {
    this.filtroNombre = '';
    this.filtroCorreo = '';
    this.filtroDocumento = '';
    this.cargarUsuarios();
  }

   // ===============================
  // EXPORTAR REPORTES
  // ===============================
  exportarPDF(): void {
    const filtros = {
      nombre: this.filtroNombre || undefined,
      correo: this.filtroCorreo || undefined,
      documento: this.filtroDocumento || undefined
    };

    this.usuarioService.descargarPDF(filtros).subscribe((data: Blob) => {
      const url = URL.createObjectURL(new Blob([data], { type: 'application/pdf' }));
      const link = document.createElement('a');
      link.href = url;
      link.download = 'usuarioReporte.pdf';
      link.click();
    });
  }

  exportarExcel(): void {
    const filtros = {
      nombre: this.filtroNombre || undefined,
      correo: this.filtroCorreo || undefined,
      documento: this.filtroDocumento || undefined
    };

    this.usuarioService.descargarExcel(filtros).subscribe((data: Blob) => {
      const url = URL.createObjectURL(new Blob([data], { type: 'application/vnd.ms-excel' }));
      const link = document.createElement('a');
      link.href = url;
      link.download = 'usuarioReporte.xlsx';
      link.click();
    });
  }

  // ===============================
  // EDICIÓN Y ELIMINACIÓN
  // ===============================
  eliminarUsuario(id: number): void {
    this.usuarioService.eliminarLogico(id).subscribe({
      next: () => {
        this.mensaje = 'Usuario eliminado correctamente';
        this.cargarUsuarios();
        setTimeout(() => (this.mensaje = ''), 2500);
      },
      error: () => {
        this.error = 'No se pudo eliminar el usuario';
        setTimeout(() => (this.error = ''), 2500);
      }
    });
  }

  eliminarUsuarioFisico(id: number): void {
    this.usuarioService.eliminarLogico(id).subscribe({
      next: () => {
        this.mensaje = 'Usuario inactivado correctamente';
        this.cargarUsuarios();
        setTimeout(() => (this.mensaje = ''), 2500);
      },
      error: () => {
        this.error = 'No se pudo eliminar el usuario';
        setTimeout(() => (this.error = ''), 2500);
      }
    });
  }



  obtenerNombreRol(rolId?: number): string {
    return this.roles.find(r => r.id === rolId)?.nombre ?? 'Desconocido';
  }
}
