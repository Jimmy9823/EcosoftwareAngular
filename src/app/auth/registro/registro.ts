import { Component } from '@angular/core';
import { UsuarioService } from '../../Services/usuario.service';
import { UsuarioModel, Localidad, TipoDeMaterial } from '../../Models/usuario';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { LocalidadNombrePipe } from "../../core/pipes/LocalidadNombrePipe";
import { CloudinaryService } from '../../Services/cloudinary.service';

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
    horario: '',
    estado: true,
    fechaCreacion: new Date().toISOString(),
    tipoMaterial: []
  };

  verificarContrasena = '';
  localidades = Object.values(Localidad);
  tiposMaterial = Object.values(TipoDeMaterial);
  enviando = false;

  // Archivos
  imagenPerfilFile?: File;
  certificacionesFile?: File;

  constructor(
    private usuarioService: UsuarioService,
    private router: Router,
    private cloudinaryService: CloudinaryService
  ) { }

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

  onFileChange(event: Event, campo: 'imagen' | 'certificaciones') {
    const input = event.target as HTMLInputElement;
    if (!input.files || input.files.length === 0) return;

    const file = input.files[0];

    if (campo === 'imagen') {
      this.imagenPerfilFile = file;
      this.usuario.imagen_perfil = file.name;
    }

    if (campo === 'certificaciones') {
      this.certificacionesFile = file;
      this.usuario.certificaciones = file.name;
    }
  }

  toggleMaterial(material: string, event: any) {
    if (event.target.checked) {
      this.usuario.tipoMaterial?.push(material);
    } else {
      this.usuario.tipoMaterial = this.usuario.tipoMaterial?.filter(m => m !== material);
    }
  }

  private redirigirSegunRol(rolId: number) {
    switch (rolId) {
      case 2:
        this.router.navigate(['/ciudadano']);
        break;
      case 3:
        this.router.navigate(['/empresa']);
        break;
      case 4:
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

  // Metodo para subir imágenes antes de registrar usuario
  async subirImagenYRegistrar() {
  if (this.enviando || !this.contrasenasCoinciden()) return;

  this.enviando = true;
    console.log(this.imagenPerfilFile);

  try {
    if (this.imagenPerfilFile) {
      const response: any = await this.cloudinaryService
        .subirArchivo(this.imagenPerfilFile)
        .toPromise();

      this.usuario.imagen_perfil = response.secure_url;
    }

    if (this.certificacionesFile) {
      const response: any = await this.cloudinaryService
        .subirArchivo(this.certificacionesFile)
        .toPromise();

      this.usuario.certificaciones = response.secure_url;
    }

    this.registrar();

  } catch (error) {
    console.error(error);
    alert('Error subiendo archivos');
    this.enviando = false;
  }
}

}
