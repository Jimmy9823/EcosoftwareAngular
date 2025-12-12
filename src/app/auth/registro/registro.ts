import { Component } from '@angular/core';
import { UsuarioService } from '../../Services/usuario.service';
import { UsuarioModel, Localidad } from '../../Models/usuario';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { LocalidadNombrePipe } from "../../core/pipes/LocalidadNombrePipe";

@Component({
  selector: 'app-registro',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, LocalidadNombrePipe],
  templateUrl: './registro.html',
  styleUrls: ['./registro.css']
})
export class Registro {

  usuario: UsuarioModel = {
    rolId: 2,
    nombre: '',
    contrasena: '',
    correo: '',
    cedula: '',
    telefono: '',
    direccion: '',
    localidad: '' as Localidad,
    estado: true,
    fechaCreacion: new Date().toISOString()
  };

  verificarContrasena: string = '';
  localidades = Object.values(Localidad);
  enviando = false;

  constructor(
    private usuarioService: UsuarioService,
    private router: Router
  ) {}

  registrar() {
    if (this.enviando || !this.contrasenasCoinciden()) return;
    
    this.enviando = true;
    console.log('Datos a enviar:', this.usuario);

    this.usuarioService.guardar(this.usuario).subscribe({
      next: (response) => {
        console.log('Registro exitoso:', response);
        this.enviando = false;
        alert('Usuario registrado correctamente');
        
        this.redirigirSegunRol(this.usuario.rolId!);
      },
      error: (error) => {
        console.error('Error:', error);
        this.enviando = false;
        
        if (error.status === 409) {
          alert('El usuario ya existe (correo o cédula duplicados)');
        } else if (error.status === 400) {
          alert('Datos inválidos. Verifique la información.');
        } else {
          alert('Error al registrar usuario');
        }
      }
    });
  }

  private redirigirSegunRol(rolId: number) {
    switch (rolId) {
      case 2: // Ciudadano
        this.router.navigate(['/ciudadano']);
        break;
      case 3: // Empresa
        this.router.navigate(['/empresa']);
        break;
      case 4: // Reciclador
        this.router.navigate(['/reciclador']);
        break;
      default:
        this.router.navigate(['/login']);
    }
  }

  validarFuerte(valor: string): boolean {
    if (!valor) return false;
    const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_\-+=\[{\]};:<>|./?]).+$/;
    return regex.test(valor);
  }

  contrasenasCoinciden(): boolean {
    return this.usuario.contrasena === this.verificarContrasena;
  }

  getLocalidadNombre(localidadBD: string): string {
  switch (localidadBD) {
    case 'Usaquen': return 'Usaquén';
    case 'Chapinero': return 'Chapinero';
    case 'Santa_Fe': return 'Santa Fe';
    case 'San_Cristobal': return 'San Cristóbal';
    case 'Usme': return 'Usme';
    case 'Tunjuelito': return 'Tunjuelito';
    case 'Bosa': return 'Bosa';
    case 'Kennedy': return 'Kennedy';
    case 'Fontibon': return 'Fontibón';
    case 'Engativa': return 'Engativá';
    case 'Suba': return 'Suba';
    case 'Barrios_Unidos': return 'Barrios Unidos';
    case 'Teusaquillo': return 'Teusaquillo';
    case 'Los_Martires': return 'Los Mártires';
    case 'Antonio_Nariño': return 'Antonio Nariño';
    case 'Puente_Aranda': return 'Puente Aranda';
    case 'Candelaria': return 'Candelaria';
    case 'Rafael_Uribe_Uribe': return 'Rafael Uribe Uribe';
    case 'Ciudad_Bolivar': return 'Ciudad Bolívar';
    case 'Sumapaz': return 'Sumapaz';

    default:
      // Si llega una localidad nueva o escrita distinto, fallback automático
      return localidadBD
        .replace(/_/g, ' ')
        .replace(/\b\w/g, l => l.toUpperCase());
  }
}

}