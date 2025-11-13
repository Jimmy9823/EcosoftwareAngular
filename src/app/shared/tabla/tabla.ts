import { Component, Input } from '@angular/core';
import { COMPARTIR_IMPORTS } from '../imports';

@Component({
  selector: 'app-tabla',
  imports: [COMPARTIR_IMPORTS],
  templateUrl: './tabla.html',
  styleUrl: './tabla.css'
})
export class Tabla {
  @Input() columns: { key: string, label: string }[] = [];
  @Input() data: any[] = [];
}
