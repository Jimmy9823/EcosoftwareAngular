import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { UsuarioService } from '../../../Services/usuario.service';
import { UsuarioModel } from '../../../Models/usuario';
import { COMPARTIR_IMPORTS } from '../../../shared/imports';
import { ColumnaTabla, Tabla } from '../../../shared/tabla/tabla';
import { Boton } from '../../../shared/botones/boton/boton';
import { Modal } from '../../../shared/modal/modal';
import { FieldConfig, FormComp } from '../../../shared/form/form.comp/form.comp';

@Component({
  selector: 'app-usuario-tabla',
  templateUrl: './usuario.html',
  styleUrls: ['./usuario.css'],
  imports: [COMPARTIR_IMPORTS, Tabla, Boton, Modal,FormComp],
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

  // ===============================
  // Filtros con FormComp
  // ===============================
  formFiltros: FormGroup = new FormGroup({});

  fieldsFiltros: FieldConfig[] = [
  { type: 'select', name: 'criterio', label: 'Criterio', cols: 4, options: [
      { value: 'nombre', text: 'Nombre' },
      { value: 'correo', text: 'Correo' },
      { value: 'documento', text: 'Documento' }
  ] },
  { type: 'text', name: 'nombre', label: 'Buscar por nombre', placeholder: 'Ingrese nombre', cols: 4,
    showIf: () => this.formFiltros.get('criterio')?.value === 'nombre' },
  { type: 'text', name: 'correo', label: 'Buscar por correo', placeholder: 'Ingrese correo', cols: 4,
    showIf: () => this.formFiltros.get('criterio')?.value === 'correo' },
  { type: 'text', name: 'documento', label: 'Buscar por documento', placeholder: 'Ingrese documento', cols: 4,
    showIf: () => this.formFiltros.get('criterio')?.value === 'documento' }
];


  // ===============================
  // Roles
  // ===============================
  roles = [
    { id: 1, nombre: 'Administrador' },
    { id: 2, nombre: 'Ciudadano' },
    { id: 3, nombre: 'Empresa' },
    { id: 4, nombre: 'Reciclador' }
  ];

  // ===============================
  // Tabla
  // ===============================
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

  accionesEliminar = [
    {
      texto: 'Inactivar',
      icono: 'bi-pause-circle',
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

  constructor(private usuarioService: UsuarioService) {
    // Inicializa controles del formFiltros
    this.fieldsFiltros.forEach(f => {
      if (f.type !== 'separator') {
        this.formFiltros.addControl(f.name!, new FormControl(f.name === 'criterio' ? 'nombre' : ''));
      }
    });
  }

  ngOnInit(): void {
    this.cargarUsuarios();
  }

  // ===============================
  // MODALES
  // ===============================
  abrirModalReportes(): void {
    this.modalReportes.isOpen = true;
  }

  abrirModalEliminar(usuario: UsuarioModel): void {
    this.usuarioSeleccionado = usuario;
    this.modalEliminar.isOpen = true;
  }

  abrirModalEliminarFisico(usuario: UsuarioModel): void {
    this.usuarioSeleccionado = usuario;
    this.modalEliminarFisico.isOpen = true;
  }

  cerrarModalEliminar(): void {
    this.modalEliminar.close();
    this.usuarioSeleccionado = null;
  }

  confirmarEliminacion(): void {
    if (!this.usuarioSeleccionado?.idUsuario) return;
    this.eliminarUsuario(this.usuarioSeleccionado.idUsuario);
    this.cerrarModalEliminar();
  }

  confirmarEliminacionFisica(): void {
    if (!this.usuarioSeleccionado?.idUsuario) return;

    this.usuarioService.eliminarFisico(this.usuarioSeleccionado.idUsuario).subscribe({
      next: () => {
        this.mensaje = 'Usuario eliminado permanentemente';
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
  // USUARIOS
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
    const formValue = this.formFiltros.value;
    const criterio = formValue.criterio;
    const valor = formValue[criterio];

    if (!valor?.trim()) {
      this.cargarUsuarios();
      return;
    }

    this.cargando = true;

    this.usuarioService.filtrar(criterio, valor).subscribe({
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
    this.formFiltros.reset({ criterio: 'nombre' });
    this.cargarUsuarios();
  }

  // ===============================
  // EXPORTAR REPORTES
  // ===============================
  exportarPDF(): void {
    const filtros = this.formFiltros.value;
    this.usuarioService.descargarPDF(filtros).subscribe((data: Blob) => {
      const url = URL.createObjectURL(new Blob([data], { type: 'application/pdf' }));
      const link = document.createElement('a');
      link.href = url;
      link.download = 'usuarioReporte.pdf';
      link.click();
    });
  }

  exportarExcel(): void {
    const filtros = this.formFiltros.value;
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

  // ===============================
  // UTILES
  // ===============================
  obtenerNombreRol(rolId?: number): string {
    return this.roles.find(r => r.id === rolId)?.nombre ?? 'Desconocido';
  }
}
