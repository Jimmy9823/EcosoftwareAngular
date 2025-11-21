import { Component, EventEmitter, Input, Output } from '@angular/core';
import { COMPARTIR_IMPORTS } from '../imports';

export interface ColumnaTabla {
  campo: string;
  titulo: string;
}

@Component({
  selector: 'app-tabla',
  imports: [COMPARTIR_IMPORTS],
  templateUrl: './tabla.html',
  styleUrl: './tabla.css'
})
export class Tabla {
@Input() columns: any[] = [];

  @Input() columnas: ColumnaTabla[] = [];
  @Input() data: any[] = [];
  @Input() titulo: string = 'Listado';

  @Output() ver = new EventEmitter<any>();
  @Output() editar = new EventEmitter<any>();
  @Output() eliminar = new EventEmitter<any>();
  @Output() nuevo = new EventEmitter<void>();
  @Output() exportar = new EventEmitter<void>();

  pagina: number = 1;
  porPagina: number = 10;

  cambiarPagina(p: number) {
    this.pagina = p;
  }

  get datosPaginados() {
    const inicio = (this.pagina - 1) * this.porPagina;
    return this.data.slice(inicio, inicio + this.porPagina);
  }

  get totalPaginas() {
    return Math.ceil(this.data.length / this.porPagina);
  }

  get showingFrom() {
    return (this.pagina - 1) * this.porPagina + 1;
  }

  get showingTo() {
    const calc = this.pagina * this.porPagina;
    return calc > this.data.length ? this.data.length : calc;
  }

  get totalPaginasArray() {
    return Array.from({ length: this.totalPaginas }, (_, i) => i + 1);
  }
}
