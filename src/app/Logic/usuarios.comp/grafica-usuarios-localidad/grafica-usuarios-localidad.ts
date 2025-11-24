import { Component, OnInit, AfterViewInit } from '@angular/core';
import { UsuarioService } from '../../../Services/usuario.service';
import Chart from 'chart.js/auto';

@Component({
  selector: 'app-grafico-usuarios-localidad',
  standalone: true,
  templateUrl: './grafica-usuarios-localidad.html',
  styleUrls: ['./grafica-usuarios-localidad.css']
})
export class GraficoUsuariosLocalidad implements OnInit, AfterViewInit {

  localidades: string[] = [];
  ciudadanos: number[] = [];
  empresas: number[] = [];
  recicladores: number[] = [];

  constructor(private usuarioService: UsuarioService) {}

  ngOnInit(): void {
    this.usuarioService.obtenerGraficoLocalidadRol().subscribe(data => {

      this.localidades = Object.keys(data);
      this.ciudadanos = this.localidades.map(l => data[l].Ciudadano || 0);
      this.empresas = this.localidades.map(l => data[l].Empresa || 0);
      this.recicladores = this.localidades.map(l => data[l].Reciclador || 0);

      if (this.chartReady) this.createChart();
    });
  }

  private chartReady: boolean = false;

  ngAfterViewInit(): void {
    this.chartReady = true;
    this.createChart();
  }

  createChart() {
    if (!this.localidades.length) return; // aún no hay datos

    new Chart("usuariosLocalidadChart", {
      type: 'bar',
      data: {
        labels: this.localidades,
        datasets: [
          { label: 'Ciudadanos', data: this.ciudadanos, backgroundColor: 'rgba(54,162,235,0.6)' },
          { label: 'Empresas', data: this.empresas, backgroundColor: 'rgba(255,99,132,0.6)' },
          { label: 'Recicladores', data: this.recicladores, backgroundColor: 'rgba(75,192,192,0.6)' }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false
      }
    });
  }
}
