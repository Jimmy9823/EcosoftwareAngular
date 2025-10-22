import { Component, Input,  Output, EventEmitter } from '@angular/core';
import { IconDefinition } from '@fortawesome/fontawesome-svg-core';
import { COMPARTIR_IMPORTS } from '../../ImpCondYForms/imports';

export interface BarraLateralItem {
  id: string
  label: string
  icon?: IconDefinition | string
}

@Component({
  selector: 'app-barra-lateral',
  imports: [COMPARTIR_IMPORTS],
  templateUrl: './barra-lateral.html',
  styleUrl: './barra-lateral.css'
})


export class BarraLateral {

  @Input() items: BarraLateralItem[] = []
  @Input() selected: string = ''
  @Output() selectedChange = new EventEmitter<string>()

  seleccionarVista(vista: string): void {
    this.selected = vista
    this.selectedChange.emit(vista)
  }
}
