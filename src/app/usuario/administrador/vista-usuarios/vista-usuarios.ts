import { Component } from '@angular/core';
import { COMPARTIR_IMPORTS } from '../../../ImpCondYForms/imports';

@Component({
  selector: 'app-vista-usuarios',
  imports: [COMPARTIR_IMPORTS],
  templateUrl: './vista-usuarios.html',
  styleUrl: './vista-usuarios.css'
})
export class VistaUsuarios {
  usuarios = [
    { nombre: 'Juan', rol: 'Ciudadano' },
    { nombre: 'María', rol: 'Reciclador' },
    { nombre: 'Pedro', rol: 'Empresa' }
  ]
}
