import { Component } from '@angular/core';
import { UsuarioService } from '../../usuario/usuario_services/usuario.service';
import { Router } from '@angular/router';
import { UsuarioModel } from '../../usuario/usuario_models/usuario';
import { COMPARTIR_IMPORTS } from '../../ImpCondYForms/imports';
@Component({
  selector: 'app-login',
  standalone:true,
  imports: [ COMPARTIR_IMPORTS],
  templateUrl: './login.html',
  styleUrl: './login.css'
})
export class Login {
  login(data:any){

  }

  correo = '';
  contrasena = '';
  mensajeError = '';
  cargando = false;

  constructor(
    private usuarioService: UsuarioService,
    private router: Router
  ) {}

  onSubmit(): void {
    this.mensajeError = '';
    this.cargando = true;

    this.usuarioService.login(this.correo, this.contrasena).subscribe({
      next: (usuario: UsuarioModel | null) => {
        this.cargando = false;
        if (usuario) {
          localStorage.setItem('usuario', JSON.stringify(usuario));

          // Redirección por rol
          switch (usuario.rolId) {
            case 1: this.router.navigate(['/administrador']); break;
            case 2: this.router.navigate(['/ciudadano']); break;
            case 3: this.router.navigate(['/empresa']); break;
            case 4: this.router.navigate(['/reciclador']); break;
            default: this.router.navigate(['/']);
          }
        } else {
          this.mensajeError = 'Correo o contraseña incorrectos';
        }
      },
      error: () => {
        this.cargando = false;
        this.mensajeError = 'Error de conexión con el servidor';
      }
    });
  }
}

