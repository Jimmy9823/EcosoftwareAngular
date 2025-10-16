import { Component } from '@angular/core';
import { UsuarioService } from '../../usuario/usuario_services/usuario.service';
import { FormComp } from '../../shared/form/form.comp/form.comp';
import { UsuarioModel } from '../../usuario/usuario_models/usuario';
import { Router } from '@angular/router';
import { FormGeneral } from "../../shared/form/form-general/form-general";

@Component({
  selector: 'app-registro',
  imports: [FormComp, FormGeneral],
  templateUrl: './registro.html',
  styleUrls: ['./registro.css']
})
export class Registro {

  constructor(private usuarioService: UsuarioService, private router: Router) {}

  registro(data: any) {
    console.log('Datos del formulario crudo:', data);

    // Mapeo del rol (de texto → número) según DTO backend
    const rolMap: Record<string, number> = {
      'admin': 1,
      'ciudadano': 2,
      'empresa': 3,
      'reciclador': 4
    };

    // Construcción del payload según el DTO del backend
    const payload: UsuarioModel = {
      rolId: rolMap[data.rol] ?? 2,
      nombre: data.nombre,
      contrasena: data.contrasena,
      correo: data.correo,
      cedula: data.cedula,
      telefono: data.telefono,
      direccion: data.direccion,
      barrio: data.barrio,
      localidad: data.localidad,
      nit: data.nit || undefined,
      representanteLegal: data.representanteLegal || undefined,
      zona_de_trabajo: data.zonaTrabajo || undefined,
      horario: data.horario || undefined,
      tipoMaterial: (data.tipoMaterial || []).join(', ') || undefined,
      cantidad_minima: data.cantidadMinima ? Number(data.cantidadMinima) : undefined,
      imagen_perfil: undefined,
      certificaciones: undefined,
      estado: true,
      fechaCreacion: new Date().toISOString()
    };

    console.log('Payload final al backend:', payload);

    // Llamada al servicio para registrar el usuario
    this.usuarioService.guardar(payload).subscribe({
      next: (res) => {
        console.log('Usuario registrado correctamente:', res);
        alert('Usuario registrado con éxito');

        // 🔸 Redirección según el rol elegido
        switch (payload.rolId) {
          case 1:
            this.router.navigate(['/administrador']);
            break;
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
            this.router.navigate(['/']);
            break;
        }
      },
      error: (err) => {
        console.error('Error al registrar usuario:', err);
        alert('Error al registrar usuario');
      }
    });
  }




  formFields = [
  { name: 'nombre', label: 'Nombre', type: 'text' },
  { name: 'correo', label: 'Correo', type: 'email' },
  { name: 'rol', label: 'Rol', type: 'select', options: ['Usuario', 'Administrador', 'Reciclador', 'Empresa'] },
  { name: 'genero', label: 'Género', type: 'radio', options: ['Masculino', 'Femenino'] }
];

registrarUsuario(data: any) {
  console.log('Datos del formulario:', data);
}
}




