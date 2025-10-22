import { Component } from '@angular/core';
import { UsuarioService } from '../../usuario/usuario_services/usuario.service';
import { Router } from '@angular/router';
import { UsuarioModel } from '../../usuario/usuario_models/usuario';
import { COMPARTIR_IMPORTS } from '../../ImpCondYForms/imports';
import { AuthService } from '../auth.service';
@Component({
  selector: 'app-login',
  standalone:true,
  imports: [ COMPARTIR_IMPORTS],
  templateUrl: './login.html',
  styleUrl: './login.css'
})
export class Login {
   correo = '';
  contrasena = '';
  errorMessage = '';

  constructor(private authService: AuthService, private router: Router) {}

  onLogin(): void {
    const credenciales = { correo: this.correo, contrasena: this.contrasena };

    this.authService.login(credenciales).subscribe({
      next: (response) => {
        console.log('✅ Login exitoso');
        localStorage.setItem('token', response.token);
        localStorage.setItem('rol', response.rol);

         if (response.rol === 'Administrador') {
          this.router.navigate(['/administrador']);
        } else if (response.rol === 'Ciudadano') {
          this.router.navigate(['/ciudadano']);
        } else if (response.rol === 'Empresa') {
          this.router.navigate(['/empresa']);
        } else if (response.rol === 'Reciclador') {
          this.router.navigate(['/reciclador']);
        } else {
          console.warn('Rol no reconocido, redirigiendo al login');
          this.router.navigate(['/login'])
        }
      },
      error: (err) => {
        console.error(err);
        this.errorMessage = 'Credenciales incorrectas o usuario no encontrado';
      },
    });
  }
}

