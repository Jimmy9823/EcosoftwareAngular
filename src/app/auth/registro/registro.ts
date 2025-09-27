import { Component } from '@angular/core';
import { FormComp } from '../../shared/form/form.comp/form.comp';
import { UsuarioService } from '../../usuario/usuario_services/usuario.service';
import { UsuarioModel } from '../../usuario/usuario_models/usuario';
import { FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-registro',
  imports: [FormComp],
  templateUrl: './registro.html',
  styleUrl: './registro.css'
})
export class Registro {
  usuarios: UsuarioModel[] = [];
  mensaje: string = '';
  cargando: boolean = true;
  error: string = '';
   // Formulario adaptable para filtros

  constructor( private usuarioService: UsuarioService,
  private fb: FormBuilder,
  private router: Router) {

  }
   guardarUsuario(usuario: UsuarioModel) {
    console.log('Usuario que se enviará al backend:', usuario);
    this.usuarioService.guardarUsuario(usuario).subscribe({
      next: (data) => {
        this.mensaje = "Usuario creado con éxito";  
        this.usuarios.push(data);
        console.log(data);
        this.router.navigate(['/login']);
      },  
      error: (err) => {
        this.error = 'Error al crear usuario';
        console.log(err);
      }
    });
  }

  registro(data: any) {
  console.log('Datos recibidos en registro:', data);

  const usuario: UsuarioModel = {
    ...data,
    cantidad_minima: data.cantidad_minima ? Number(data.cantidad_minima)  : null,
    nit: data.nit || null,
    zona_de_trabajo: data.zona_de_trabajo || null,
    horario: data.horario || null,
    certificaciones: data.certificaciones || null,
    imagen_perfil: data.imagen_perfil || null
  };

  this.guardarUsuario(usuario);
}

}
