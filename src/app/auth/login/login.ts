import { Component } from '@angular/core';
import { UsuarioService } from '../../usuario/usuario_services/usuario.service';
import { Router } from '@angular/router';
import { UsuarioModel } from '../../usuario/usuario_models/usuario';
import { COMPARTIR_IMPORTS } from '../../ImpCondYForms/imports';
import { AuthService } from '../auth.service';
import { FormGeneral } from '../../shared/form/form-general/form-general';
@Component({
  selector: 'app-login',
  standalone:true,
  imports: [ COMPARTIR_IMPORTS, FormGeneral],
  templateUrl: './login.html',
  styleUrl: './login.css'
})
export class Login {
  correo = '';
  contrasena = '';
  errorMessage = '';
  campos = [
  { name: 'correo', label: 'Correo', type: 'email', placeholder: 'Ingrese su correo' },
  { name: 'contrasena', label: 'Contraseña', type: 'password', placeholder: 'Ingrese su contraseña' }
]

  constructor(private authService: AuthService, private router: Router) {}

  onLogin(formValue: any): void {
    console.log('📥 Datos recibidos en Login:', formValue);
  const credenciales = {
    
    correo: formValue.correo,
    contrasena: formValue.contrasena
  };

  this.authService.login(credenciales).subscribe({
    next: (response) => {
      console.log('✅ Login exitoso');
      localStorage.setItem('token', response.token);
      localStorage.setItem('rol', response.rol);

      switch (response.rol) {
        case 'Administrador': this.router.navigate(['/administrador']); break;
        case 'Ciudadano': this.router.navigate(['/ciudadano']); break;
        case 'Empresa': this.router.navigate(['/empresa']); break;
        case 'Reciclador': this.router.navigate(['/reciclador']); break;
        default:
          console.warn('Rol no reconocido, redirigiendo al login');
          this.router.navigate(['/login']);
      }
    },
    error: (err) => {
      console.error(err);
      this.errorMessage = 'Credenciales incorrectas o usuario no encontrado';
    },
  });
}
}

