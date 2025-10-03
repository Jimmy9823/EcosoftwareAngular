import { Component } from '@angular/core';
import { UsuarioService } from '../usuario_services/usuario.service';
import { UsuarioModel } from '../usuario_models/usuario';
import { Header } from '../../shared/header/header';
import { COMPARTIR_IMPORTS } from '../../ImpCondYForms/imports';
import { FormComp } from '../../shared/form/form.comp/form.comp';
import { Solcitudes } from '../../solcitudes/solcitudes';

@Component({
  selector: 'app-administrador',
  imports: [Header, COMPARTIR_IMPORTS, FormComp, Solcitudes],
  templateUrl: './administrador.html',
  styleUrl: './administrador.css'
})
export class Administrador {
  usuarios: UsuarioModel[] = [];
  cargando: boolean = false;
  error: string = '';
  mensaje: string = '';
  rol: string = '';

  // 🔸 Ya no necesitamos las propiedades criterio y valorFiltro manuales
  constructor(private usuarioService: UsuarioService) {}

  ngOnInit(): void {
    this.consultarUsuarios();
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
      },
      error: (err) => {
        console.error('Error al cargar usuarios:', err);
        this.error = 'Error al cargar la lista de usuarios';
        this.mensaje = '';
        this.cargando = false;
      }
    });
  }

  // ========================
  // APLICAR FILTRO (desde FormComp)
  // ========================
  aplicarFiltroDesdeForm(filtro: { criterio: string; valor: string }): void {
    const { criterio, valor } = filtro;

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
      },
      error: (err) => {
        console.error('Error al filtrar usuarios:', err);
        this.error = 'Error al filtrar usuarios';
        this.mensaje = '';
        this.cargando = false;
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

  generarExcel(): void {
    this.cargando = true;
    this.usuarioService.generarReporte().subscribe({
      next: (lista) => {
        this.usuarios = lista.map(usuario => ({
          ...usuario,
          rol: this.obtenerNombreRol(usuario.rolId)
        }));

        this.cargando = false;
        this.mensaje = `Se cargaron ${lista.length} usuario(s)`;
        this.error = '';
      },
      error: (err) => {
        console.error('Error al cargar usuarios:', err);
        this.error = 'Error al cargar la lista de usuarios';
        this.mensaje = '';
        this.cargando = false;
      }
    });
  }
}
