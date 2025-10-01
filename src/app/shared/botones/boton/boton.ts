import { Component, EventEmitter, Input, Output } from '@angular/core';
import { NgStyle } from '@angular/common';

@Component({
  standalone:true,
  selector: 'app-boton',
  imports: [NgStyle],
  templateUrl: './boton.html',
  styleUrl: './boton.css'
})
export class Boton {
  //Texto que se mostrata en el boton 
  //Igual a <button> Boton </button>
  @Input() label: string = ' '
  // Estilo de bootstrap 
  @Input() tipo: string = ''
  //Habilitado o desabilitado
  @Input() disabled: boolean = false

  @Input() estilo: {[key:string]:string}={}

  @Input() icono : string = ' '
  //Evento a ejecutar segun metodos
  @Output() accion = new EventEmitter<void>()

  ejecutarAccion() {
    this.accion.emit()
  }

}
