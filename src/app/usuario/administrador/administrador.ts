import { Component } from '@angular/core';
import { UsuarioService } from '../usuario_services/usuario.service';
import { UsuarioModel } from '../usuario_models/usuario';
import { Header } from '../../shared/header/header';
import { COMPARTIR_IMPORTS } from '../../ImpCondYForms/imports';
import { FormComp } from '../../shared/form/form.comp/form.comp';
import { Solcitudes } from '../../solcitudes/solcitudes';
import { Boton } from "../../shared/botones/boton/boton";

@Component({
  selector: 'app-administrador',
  imports: [Header, COMPARTIR_IMPORTS, FormComp, Solcitudes, Boton],
  templateUrl: './administrador.html',
  styleUrl: './administrador.css'
})
export class Administrador {
  usuarios: UsuarioModel[] = [];
  filtroNombre: string = '';
  filtroCorreo: string = '';
  filtroDocumento: string = '';
  cargando: boolean = false;
  error: string = '';
  mensaje: string = '';
  rol: string = '';
  vistaActual:'panel'| 'usuarios' | 'solicitudes' | 'recolecciones' |'puntos'|'noticias'| null = null;


  // 🔸 Ya no necesitamos las propiedades criterio y valorFiltro manuales
  constructor(private usuarioService: UsuarioService) {}

  ngOnInit(): void {
    this.consultarUsuarios();
  }

  cambiarVista(vista:'panel'| 'usuarios' | 'solicitudes' | 'recolecciones'|'puntos'|'noticias') {
  this.vistaActual = vista;
}

  // ========================
  // CONSULTAR TODOS LOS USUARIOS
  // ========================
  consultarUsuarios(): void {
    this.cargando = true;
    this.usuarioService.listar().subscribe({
      next: (lista) => {
        this.usuarios = lista.map(usuario => ({
          ...usuario,
          rol: this.obtenerNombreRol(usuario.rolId)
        }));

        this.cargando = false;
        this.mensaje = `Se cargaron ${lista.length} usuario(s)`;
        this.error = '';
        setTimeout(() => {
        this.mensaje = '';
      }, 2500);
      },
      error: (err) => {
        console.error('Error al cargar usuarios:', err);
        this.error = 'Error al cargar la lista de usuarios';
        this.mensaje = '';
        this.cargando = false;
        setTimeout(() => {
        this.mensaje = '';
        this.error = '';
      }, 2500);
      }
    });
  }

  // ========================
  // APLICAR FILTRO (desde FormComp)
  // ========================
  aplicarFiltroDesdeForm(filtro: { criterio: string; valor: string }): void {
  const { criterio, valor } = filtro;

  // 🔸 Guardar el filtro aplicado
  if (criterio === 'nombre') {
    this.filtroNombre = valor;
  } else if (criterio === 'correo') {
    this.filtroCorreo = valor;
  } else if (criterio === 'documento') {
    this.filtroDocumento = valor;
  }

  if (!valor || !valor.trim()) {
    this.consultarUsuarios();
    return;
  }

  this.cargando = true;
  this.usuarioService.filtrar(criterio, valor).subscribe({
    next: (usuariosFiltrados) => {
      this.usuarios = usuariosFiltrados.map(usuario => ({
        ...usuario,
        rol: this.obtenerNombreRol(usuario.rolId)
      }));
      this.mensaje = `${usuariosFiltrados.length} usuario(s) encontrado(s)`;
      this.error = '';
      this.cargando = false;
      setTimeout(() => {
        this.mensaje = '';
      }, 2500);
    },
    error: (err) => {
      console.error('Error al filtrar usuarios:', err);
      this.error = 'Error al filtrar usuarios';
      this.mensaje = '';
      this.cargando = false;
      setTimeout(() => {
        this.mensaje = '';
        this.error = '';
      }, 2500);
    }
  });
}

  // ========================
  // LIMPIAR FILTRO (desde FormComp)
  // ========================
  limpiarFiltro(): void {
    this.consultarUsuarios();
  }

  // ========================
  // OBTENER NOMBRE DE ROL
  // ========================
  private obtenerNombreRol(rolId: number): string {
    switch (rolId) {
      case 1: return 'Administrador';
      case 2: return 'Ciudadano';
      case 3: return 'Empresa';
      case 4: return 'Reciclador';
      default: return 'Desconocido';
    }
  }

  exportarPDF(): void {
      const filtros = {
        nombre: this.filtroNombre || undefined,
        correo: this.filtroCorreo || undefined,
        documento: this.filtroDocumento || undefined
      };
  
      this.usuarioService.descargarPDF(filtros).subscribe((data: Blob) => {
        const blob = new Blob([data], { type: 'application/pdf' });
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = 'usuarioReporte.pdf';
        link.click();
      });
    }

  // 📊 Exportar Excel con filtros
    exportarExcel(): void {
      const filtros = {
        nombre: this.filtroNombre || undefined,
        correo: this.filtroCorreo || undefined,
        documento: this.filtroDocumento || undefined
      };
  
      this.usuarioService.descargarExcel(filtros).subscribe((data: Blob) => {
        const blob = new Blob([data], { type: 'application/vnd.ms-excel' });
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = 'usuarioReporte.xlsx';
        link.click();
      });
    }

     menuAbierto = true;
perfilMenuAbierto = false;

toggleMenu() {
  this.menuAbierto = !this.menuAbierto;
  if(!this.menuAbierto) this.perfilMenuAbierto = false; // cierra perfil al colapsar
}

togglePerfilMenu() {
  this.perfilMenuAbierto = !this.perfilMenuAbierto;
}


}

