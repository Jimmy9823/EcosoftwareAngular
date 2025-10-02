import { Component, EventEmitter, Input, Output } from '@angular/core';
import { NgStyle } from '@angular/common';
import { COMPARTIR_IMPORTS } from '../../../ImpCondYForms/imports';

@Component({
  standalone: true,
  selector: 'app-boton',
  imports: [NgStyle, COMPARTIR_IMPORTS],
  templateUrl: './boton.html',
  styleUrl: './boton.css'
})
export class Boton {
  @Input() label: string = '';
  @Input() tipo: string = ''; 
  @Input() disabled: boolean = false;
  @Input() estilo: { [key: string]: string } = {};

  // 👉 Clases de Font Awesome, ejemplo: 'fa-solid fa-right-to-bracket'
  @Input() icono: string = '';  

  @Output() accion = new EventEmitter<void>();

  ejecutarAccion() {
    this.accion.emit();
  }
}
