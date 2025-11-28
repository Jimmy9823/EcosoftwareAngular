import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgApexchartsModule } from 'ng-apexcharts';
import { Service, PendientesAceptadas } from '../../../Services/solicitud.service';

@Component({
  selector: 'app-pendientes-aceptadas-chart',
  standalone: true,
  imports: [CommonModule, NgApexchartsModule],
  templateUrl: './pendientes-aceptadas-chart-component.html',
  styleUrls: ['./pendientes-aceptadas-chart-component.css']
})
export class PendientesAceptadasChartComponent implements OnInit {
  public chartOptions: any = {};

  constructor(private service: Service) {}

  ngOnInit() {
    // Inicializar con opciones básicas
    this.initializeEmptyChart();
    
    this.service.getPendientesYAceptadas().subscribe((data: PendientesAceptadas) => {
      this.updateChart(data);
    });
  }

  private initializeEmptyChart(): void {
    this.chartOptions = {
      series: [{
        name: 'Solicitudes',
        data: [0, 0]
      }],
      chart: {
        type: 'bar',
        height: 350,
        toolbar: {
          show: true
        }
      },
      plotOptions: {
        bar: {
          borderRadius: 4,
          horizontal: false,
          columnWidth: '70%',
          distributed: true // ¡IMPORTANTE! Esto hace que cada barra tenga su color
        }
      },
      dataLabels: {
        enabled: true
      },
      xaxis: {
        categories: ['Pendientes', 'Aceptadas']
      },
      yaxis: {
        title: {
          text: 'Cantidad'
        }
      },
      title: {
        text: 'Solicitudes Pendientes vs Aceptadas',
        align: 'center',
        style: {
          fontSize: '16px',
          fontWeight: 'bold'
        }
      },
      colors: ['#FF4560', '#00E396'], // Rojo para Pendientes, Verde para Aceptadas
      fill: {
        opacity: 1
      }
    };
  }

  private updateChart(data: PendientesAceptadas): void {
    this.chartOptions.series = [{
      name: 'Solicitudes',
      data: [data.pendientes, data.aceptadas]
    }];
  }
}