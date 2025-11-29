import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgApexchartsModule } from 'ng-apexcharts';
import { Service, SolicitudesPorLocalidad } from '../../../Services/solicitud.service';

@Component({
  selector: 'app-solicitudes-localidad-chart',
  standalone: true,
  imports: [CommonModule, NgApexchartsModule],
  templateUrl: './solicitudes-localidad-chart-component.html',
  styleUrls: ['./solicitudes-localidad-chart-component.css']
})
export class SolicitudesLocalidadChartComponent implements OnInit {
  public chartOptions: any = {};

  constructor(private service: Service) {}

  ngOnInit() {
  this.service.getSolicitudesPorLocalidadFactory().subscribe((data: SolicitudesPorLocalidad[]) => {
    this.initChart(data);
  });
}


  private initChart(data: SolicitudesPorLocalidad[]): void {
    const colors = this.generateColors(data.length);

    this.chartOptions = {
      series: [{
        name: 'Solicitudes',
        data: data.map(item => ({
          x: item.localidad,
          y: item.cantidad,
          fillColor: colors[data.indexOf(item)] // Asignar color específico a cada barra
        }))
      }],
      chart: {
        type: 'bar',
        height: 400,
        toolbar: {
          show: true
        }
      },
      plotOptions: {
        bar: {
          borderRadius: 4,
          horizontal: true,
          distributed: true // Esta es la clave
        }
      },
      dataLabels: {
        enabled: true,
        formatter: function(val: number) {
          return val.toString();
        }
      },
      xaxis: {
        categories: data.map(item => item.localidad),
      },
      colors: colors, // Array de colores
      title: {
        
        align: 'center',
        style: {
          fontSize: '16px',
          fontWeight: 'bold'
        }
      },
      tooltip: {
        y: {
          formatter: function(val: number) {
            return val + " solicitudes";
          }
        }
      }
    };
  }

  private generateColors(count: number): string[] {
    // Paleta de colores más amplia y distintiva
    const colorPalette = [
      '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7',
      '#DDA0DD', '#98D8C8', '#F7DC6F', '#BB8FCE', '#85C1E9',
      '#F8C471', '#82E0AA', '#F1948A', '#85C1E9', '#D7BDE2',
      '#F9E79F', '#A9DFBF', '#F5B7B1', '#AED6F1', '#E8DAEF',
      '#FAD7A0', '#ABEBC6', '#F5CBA7', '#AED6F1', '#D2B4DE',
      '#FDEBD0', '#A3E4D7', '#F5B7B1', '#D6EAF8', '#E8DAEF',
      '#FDEDEC', '#D1F2EB', '#FADBD8', '#D4E6F1', '#EBDEF0'
    ];

    if (count <= colorPalette.length) {
      return colorPalette.slice(0, count);
    }

    // Generar colores adicionales si es necesario
    const additionalColors = [];
    for (let i = colorPalette.length; i < count; i++) {
      const hue = (i * 137.5) % 360; // Ángulo dorado
      const saturation = 70 + (i % 20); // Variar saturación
      const lightness = 50 + (i % 30); // Variar luminosidad
      additionalColors.push(`hsl(${hue}, ${saturation}%, ${lightness}%)`);
    }

    return [...colorPalette, ...additionalColors].slice(0, count);
  }
}