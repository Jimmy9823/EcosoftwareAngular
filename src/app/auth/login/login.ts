import { Component, HostListener, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';
import { COMPARTIR_IMPORTS } from '../../shared/imports';
import { FormGeneral } from '../../shared/form/form-general/form-general';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [COMPARTIR_IMPORTS, FormGeneral, RouterModule],
  templateUrl: './login.html',
  styleUrl: './login.css'
})
export class Login implements OnInit {

  correo = '';
  contrasena = '';
  errorMessage = '';

  // Campos del formulario (siguen igual)
  campos = [
    { name: 'correo', label: 'Correo', type: 'email', placeholder: 'Ingrese su correo' },
    { name: 'contrasena', label: 'Contraseña', type: 'password', placeholder: 'Ingrese su contraseña' }
  ];

  // 🌱 Propiedades para la animación ecológica
  fade = false;
  residues = [
    { icon: '🗑️', name: 'Residuos Ordinarios', color: '#6b7280' },
    { icon: '♻️', name: 'Residuos Reciclables', color: '#3b82f6' },
    { icon: '🍎', name: 'Residuos Orgánicos', color: '#84cc16' },
    { icon: '🔋', name: 'Residuos Peligrosos', color: '#ef4444' },
    { icon: '🏥', name: 'Residuos Hospitalarios', color: '#f59e0b' },
    { icon: '💻', name: 'Residuos Electrónicos', color: '#8b5cf6' },
    { icon: '🧪', name: 'Residuos Químicos', color: '#ec4899' },
    { icon: '🏗️', name: 'Residuos de Construcción', color: '#78716c' }
  ];
  currentIndex = 0;
  currentResidue = this.residues[0];

  constructor(private authService: AuthService, private router: Router) { }

  //  Animación al iniciar el componente
  ngOnInit(): void {
    setInterval(() => this.rotateResidue(), 3000);
  }

  //  Cambia ícono y texto de residuos
  rotateResidue() {
    this.fade = true;
    setTimeout(() => {
      this.currentIndex = (this.currentIndex + 1) % this.residues.length;
      this.currentResidue = this.residues[this.currentIndex];
      this.fade = false;
    }, 500);
  }

  // Login modificado con validación de campos
  onLogin(formValue: any): void {
    console.log('Datos recibidos en Login:', formValue);

    // Resetear mensaje de error
    this.errorMessage = '';

    const correo = formValue.correo?.trim() || '';
    const contrasena = formValue.contrasena?.trim() || '';

    // Validación de campos vacíos
    if (!correo && !contrasena) {
      this.errorMessage = 'Por favor, ingrese su correo y contraseña.';
      return;
    }

    if (!correo) {
      this.errorMessage = 'Por favor, ingrese su correo.';
      return;
    }

    if (!contrasena) {
      this.errorMessage = 'Por favor, ingrese su contraseña.';
      return;
    }

    const credenciales = {
      correo: correo,
      contrasena: contrasena
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
        console.error('Error en login:', err);

        if (err.status === 401) {
          this.errorMessage = 'Correo o contraseña incorrectos. Verifique sus credenciales.';
      
        } else if (err.status === 500) {
          this.errorMessage = 'Error en el servidor. Intente de nuevo más tarde.';
        } else {
          this.errorMessage = 'Ha ocurrido un error inesperado. Intente nuevamente.';
        }
      },
    });
  }

  // 🍃 Efecto visual de movimiento de hojas con el mouse
  @HostListener('document:mousemove', ['$event'])
  onMouseMove(e: MouseEvent) {
    const leaves = document.querySelectorAll('.floating-leaves');
    const mouseX = e.clientX / window.innerWidth;
    const mouseY = e.clientY / window.innerHeight;

    leaves.forEach((leaf, index) => {
      const speed = (index + 1) * 10;
      const x = mouseX * speed;
      const y = mouseY * speed;
      (leaf as HTMLElement).style.transform = `translate(${x}px, ${y}px) rotate(${x}deg)`;
    });
  }
}