import { Component } from '@angular/core'
import { UsuarioService } from '../../usuario/usuario_services/usuario.service'
import { FormComp } from '../../shared/form/form.comp/form.comp'
import { UsuarioModel } from '../../usuario/usuario_models/usuario'
import { Router } from '@angular/router';

@Component({
  selector: 'app-registro',
  imports: [FormComp],
  templateUrl: './registro.html',
  styleUrls: ['./registro.css']
})
export class Registro {

  constructor(private usuarioService: UsuarioService, private router:Router) {}

  registro(data: any) {
    console.log('Datos del formulario crudo:', data)

    //Mapeo del rol (de texto → número)// El dto pide numero
    const rolMap: Record<string, number> = {
      'admin': 1,
      'ciudadano': 2,
      'empresa': 3,
      'reciclador': 4
    }

    // Construcción del payload según el DTO del backend
    // Campos con el mismo nombre del usuario model
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
}

    console.log(' Payload final al backend:', payload) // Revisar que los datos sean los adecuados
    // Este console log sirve para verificar que no se este enviadno otro tipo de dato al requerido

    this.usuarioService.guardar(payload).subscribe({
      next: (res) => {
        console.log('Usuario registrado correctamente:', res)
        alert('Usuario registrado con éxito')
        this.router.navigate(['/usuarios']);
      },
      error: (err) => {
        console.error('Error al registrar usuario:', err)
        alert('Error al registrar usuario')
      }
    })
  }
}
