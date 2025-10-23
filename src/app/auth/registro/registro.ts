import { Component } from '@angular/core';
import { UsuarioService } from '../../usuario/usuario_services/usuario.service';
import { UsuarioModel } from '../../usuario/usuario_models/usuario';
import { Router } from '@angular/router';
import { FormGeneral } from "../../shared/form/form-general/form-general";

export interface Field {
  name: string
  label: string
  type: string
  placeholder?: string
  options?: string[]   // ← Ahora es opcional, no rompe los campos normales
}
@Component({
  selector: 'app-registro',
  imports: [FormGeneral],
  standalone: true,
  templateUrl: './registro.html',
  styleUrls: ['./registro.css']
})

export class Registro {

  constructor(private usuarioService: UsuarioService, private router: Router) {}

  // --- Campos base: solo Rol ---
  formFields: Field[] = [
    { 
      name: 'rol', 
      label: 'Rol', 
      type: 'select', 
      options: ['Ciudadano', 'Empresa', 'Reciclador'], 
      placeholder: 'Selecciona tu rol' 
    }
  ];

  // --- Cuando el usuario selecciona un rol ---
  onFieldChange(event: any) {
    if (event.name === 'rol') {
      const rol = event.value.toLowerCase();

      // Mantener el campo 'rol' siempre visible
      const rolField = this.formFields.find(f => f.name === 'rol');

      if (rol === 'ciudadano') {
        this.formFields = [
          rolField!, // mantener select arriba
          { name: 'nombre', label: 'Nombre', type: 'text', placeholder: 'Escribe tu nombre completo' },
          { name: 'correo', label: 'Correo', type: 'email', placeholder: 'ejemplo@correo.com' },
          { name: 'cedula', label: 'Cédula', type: 'text', placeholder: 'Número de cédula' },
          { name: 'telefono', label: 'Teléfono', type: 'text', placeholder: 'Número de teléfono' },
          { name: 'direccion', label: 'Dirección', type: 'text', placeholder: 'Ej: Calle 123 #45-67' },
          { name: 'barrio', label: 'Barrio', type: 'text', placeholder: 'Nombre del barrio' },
          { name: 'localidad', label: 'Localidad', type: 'text', placeholder: 'Ej: Suba, Engativá...' },
          { name: 'contrasena', label: 'Contraseña', type: 'password', placeholder: 'Crea una contraseña segura' }
        ];
      } 
      else if (rol === 'empresa') {
        this.formFields = [
          rolField!,
          { name: 'nombre', label: 'Nombre Empresa', type: 'text', placeholder: 'Nombre legal de la empresa' },
          { name: 'correo', label: 'Correo', type: 'email', placeholder: 'correo@empresa.com' },
          { name: 'nit', label: 'NIT', type: 'text', placeholder: 'Número NIT sin guiones' },
          { name: 'representanteLegal', label: 'Representante Legal', type: 'text', placeholder: 'Nombre del representante legal' },
          { name: 'telefono', label: 'Teléfono', type: 'text', placeholder: 'Teléfono de contacto' },
          { name: 'direccion', label: 'Dirección', type: 'text', placeholder: 'Dirección de la empresa' },
          { name: 'barrio', label: 'Barrio', type: 'text', placeholder: 'Barrio o zona' },
          { name: 'localidad', label: 'Localidad', type: 'text', placeholder: 'Ej: Chapinero, Usaquén...' },
          { name: 'contrasena', label: 'Contraseña', type: 'password', placeholder: 'Crea una contraseña segura' }
        ];
      } 
      else if (rol === 'reciclador') {
        this.formFields = [
          rolField!,
          { name: 'nombre', label: 'Nombre Reciclador', type: 'text', placeholder: 'Nombre completo' },
          { name: 'correo', label: 'Correo', type: 'email', placeholder: 'ejemplo@correo.com' },
          { name: 'cedula', label: 'Cédula', type: 'text', placeholder: 'Número de cédula' },
          { name: 'telefono', label: 'Teléfono', type: 'text', placeholder: 'Número de teléfono' },
          { name: 'zonaTrabajo', label: 'Zona de Trabajo', type: 'text', placeholder: 'Ej: Centro, Norte, Sur...' },
          { name: 'horario', label: 'Horario', type: 'text', placeholder: 'Ej: 8:00 AM - 5:00 PM' },
          { name: 'tipoMaterial', label: 'Tipo de Material', type: 'checkbox', options: ['Plástico', 'Vidrio', 'Papel', 'Cartón', 'Metal'] },
          { name: 'cantidadMinima', label: 'Cantidad Mínima (kg)', type: 'number', placeholder: 'Ej: 10' },
          { name: 'contrasena', label: 'Contraseña', type: 'password', placeholder: 'Crea una contraseña segura' }
        ];
      }
    }
  }

  // --- Envío del formulario ---
  registrarUsuario(data: any) {
    console.log('Datos del formulario:', data);

    const rolMap: Record<string, number> = {
      'ciudadano': 2,
      'empresa': 3,
      'reciclador': 4
    };

    const payload: UsuarioModel = {
      rolId: rolMap[data.rol?.toLowerCase()] ?? 2,
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

    this.usuarioService.guardar(payload).subscribe({
      next: (res) => {
        console.log('Usuario registrado correctamente:', res);
        alert('Usuario registrado con éxito');

        // Redirección por rol
        switch (payload.rolId) {
          case 2: this.router.navigate(['/ciudadano']); break;
          case 3: this.router.navigate(['/empresa']); break;
          case 4: this.router.navigate(['/reciclador']); break;
          default: this.router.navigate(['/']); break;
        }
      },
      error: (err) => {
        console.error('Error al registrar usuario:', err);
        alert('Error al registrar usuario');
      }
    });
  }
}
