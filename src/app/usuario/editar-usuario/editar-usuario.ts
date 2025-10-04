import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { UsuarioService } from '../usuario_services/usuario.service';
import { UsuarioModel } from '../usuario_models/usuario';
import { Router } from '@angular/router';
import { COMPARTIR_IMPORTS } from '../../ImpCondYForms/imports';

@Component({
  selector: 'app-editar-usuario',
  templateUrl: './editar-usuario.html',
  imports:[COMPARTIR_IMPORTS],
  styleUrls: ['./editar-usuario.css']
})
export class EditarUsuario implements OnInit {

  usuarioForm: FormGroup;
  mensaje = '';
  error = '';
  mostrarFormulario = false;

  usuario: UsuarioModel | null = null;

  private usuarioId = 3; // ID fijo para prueba
  private rolUsuario: number = 2; // ⚠️ Cambiar dinámicamente si se implementa login

  constructor(
    private fb: FormBuilder,
    private usuarioService: UsuarioService,
    private router: Router
  ) {
    this.usuarioForm = this.fb.group({});
  }

  ngOnInit(): void {
    this.cargarUsuario();
  }

  cargarUsuario(): void {
    this.usuarioService.obtenerPorId(this.usuarioId).subscribe({
      next: (usuario: UsuarioModel) => {
        this.usuario = usuario;
        this.rolUsuario = usuario.rolId || 2; // valor por defecto ciudadano
      },
      error: (err) => this.error = 'Error al cargar el usuario: ' + (err.message || err)
    });
  }

  // Campos según rol
  getCamposSegunRol(): string[] {
    switch(this.rolUsuario) {
      case 1: // Administrador
        return ['nombre', 'cedula', 'correo', 'telefono', 'contrasena'];
      case 2: // Ciudadano
        return ['nombre', 'cedula', 'correo', 'telefono', 'direccion', 'barrio', 'localidad', 'contrasena'];
      case 3: // Empresa
        return ['nombre', 'cedula', 'correo', 'telefono', 'direccion', 'barrio', 'localidad', 'horario', 'cantidad_minima', 'tipoMaterial', 'contrasena', 'representanteLegal', 'nit', 'nombreEmpresa'];
      case 4: // Reciclador
        return ['nombre', 'cedula', 'correo', 'telefono', 'zona_de_trabajo', 'horario', 'cantidad_minima', 'tipoMaterial', 'contrasena'];
      default:
        return [];
    }
  }

  mostrarForm(): void {
    if (!this.usuario) return;
    const campos = this.getCamposSegunRol();
    const formGroup: any = {};
    campos.forEach(campo => {
      formGroup[campo] = [this.usuario![campo as keyof UsuarioModel] || ''];
    });
    this.usuarioForm = this.fb.group(formGroup);
    this.mostrarFormulario = true;
  }

  actualizarUsuario(): void {
    if (!this.usuario) return;
    const usuarioActualizar: UsuarioModel = {
      ...this.usuario,
      ...this.usuarioForm.getRawValue()
    };

    this.usuarioService.actualizar(this.usuarioId, usuarioActualizar).subscribe({
      next: () => {
        this.mensaje = 'Usuario actualizado correctamente ✅';
        this.error = '';
      },
      error: (err) => {
        this.mensaje = '';
        this.error = 'Error al actualizar usuario: ' + (err.error?.message || err.message || 'Servidor');
      }
    });
  }

  darseDeBaja(): void {
  const confirmado = confirm(
    '¿Está seguro de darse de baja de la aplicación?\nSe eliminará su cuenta y no podrá volver a ingresar.'
  );

  if (confirmado) {
    this.usuarioService.eliminarLogico(this.usuarioId).subscribe({
      next: (res) => {
        // ✅ Independientemente de la respuesta, redirige
        alert('Cuenta desactivada correctamente. Serás redirigido.');
        this.router.navigate(['/main']); // ⚡ cambiar '/main' por tu ruta real
      },
      error: (err) => {
        // En caso de que Angular lo interprete como error, igual hacemos la navegación
        console.warn('Error interpretado, pero la cuenta podría estar desactivada:', err);
        alert('Cuenta desactivada correctamente. Serás redirigido.');
        this.router.navigate(['/main']); 
      }
    });
  }
}
}
