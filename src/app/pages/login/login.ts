import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UsuarioService } from '../../Services/usuario.service';
import { COMPARTIR_IMPORTS } from '../../shared/imports';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [COMPARTIR_IMPORTS],
  template: `
    <form [formGroup]="loginForm">
      <!-- Aquí va tu formulario visual, puedes reemplazarlo por el HTML real cuando lo tengas -->
      <input formControlName="usuario" placeholder="Usuario" />
      <input formControlName="password" type="password" placeholder="Contraseña" />
      <button type="submit">Ingresar</button>
    </form>
  `,
  styles: [`
    /* Aquí puedes poner estilos temporales, reemplázalos por login.css cuando lo tengas */
    form { display: flex; flex-direction: column; gap: 8px; }
    input { padding: 4px; }
    button { padding: 6px 12px; }
  `]
})
export class LoginComponent {
  loginForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private usuarioService: UsuarioService,
    private router: Router
  ) {
    this.loginForm = this.fb.group({
      usuario: ['', [Validators.required, Validators.minLength(4)]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  // ...existing code...
}