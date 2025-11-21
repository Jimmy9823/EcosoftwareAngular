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
  styleUrls: ['./tabla.css']
})
export class Tabla {
  @Input() columnas: ColumnaTabla[] = [];
  @Input() data: any[] = [];
  @Input() titulo: string = 'Listado';
    @Input() cellTemplates: { [campo: string]: (item: any) => string } = {};


  @Output() ver = new EventEmitter<any>();
  @Output() editar = new EventEmitter<any>();
  @Output() eliminar = new EventEmitter<any>();

  pagina: number = 1;
  porPagina: number = 10;

  orden: string = '';
  ascendente: boolean = true;

  // ACCIONES DINÁMICAS
  acciones = [
    { icon: 'bi-eye', color: 'view', evento: (item: any) => this.ver.emit(item) },
    { icon: 'bi-pencil', color: 'edit', evento: (item: any) => this.editar.emit(item) },
    { icon: 'bi-trash', color: 'delete', evento: (item: any) => this.eliminar.emit(item) }
  ];

  cambiarPagina(p: number) {
    this.pagina = p;
  }

  ordenar(campo: string) {
    if (this.orden === campo) this.ascendente = !this.ascendente;
    else {
      this.orden = campo;
      this.ascendente = true;
    }

    this.data.sort((a, b) => {
      if (a[campo] < b[campo]) return this.ascendente ? -1 : 1;
      if (a[campo] > b[campo]) return this.ascendente ? 1 : -1;
      return 0;
    });
  }

  get datosPaginados() {
    const inicio = (this.pagina - 1) * this.porPagina;
    return this.data.slice(inicio, inicio + this.porPagina);
  }

  get totalPaginas() {
    return Math.ceil(this.data.length / this.porPagina);
  }

  get showingFrom() {
    return this.data.length === 0 ? 0 : (this.pagina - 1) * this.porPagina + 1;
  }

  get showingTo() {
    const calc = this.pagina * this.porPagina;
    return calc > this.data.length ? this.data.length : calc;
  }

  // Páginas visibles (máx 5 botones)
  get paginasAMostrar() {
    const total = this.totalPaginas;
    const arr: number[] = [];
    const max = 5;
    let start = Math.max(this.pagina - 2, 1);
    let end = Math.min(start + max - 1, total);
    for (let i = start; i <= end; i++) arr.push(i);
    return arr;
  }
}
