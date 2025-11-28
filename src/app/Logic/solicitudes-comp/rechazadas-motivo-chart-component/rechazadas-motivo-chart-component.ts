import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgApexchartsModule } from 'ng-apexcharts';
import { Service, RechazadasPorMotivo } from '../../../Services/solicitud.service';

@Component({
  selector: 'app-rechazadas-motivo-chart',
  standalone: true,
  imports: [CommonModule, NgApexchartsModule],
  templateUrl: './rechazadas-motivo-chart-component.html',
  styleUrls: ['./rechazadas-motivo-chart-component.css']
})
export class RechazadasMotivoChartComponent implements OnInit {
  public chartOptions: any = {};

  constructor(private service: Service) {}

  ngOnInit() {
    this.initializeEmptyChart();
    
    this.service.getRechazadasPorMotivo().subscribe((data: RechazadasPorMotivo[]) => {
      this.updateChart(data);
    });
  }

  private initializeEmptyChart(): void {
    this.chartOptions = {
      series: [],
      chart: {
        type: 'donut',
        height: 350
      },
      labels: [],
      colors: [],
      responsive: [{
        breakpoint: 480,
        options: {
          chart: {
            width: 200
          },
          legend: {
            position: 'bottom'
          }
        }
      }],
      title: {
        text: 'Solicitudes Rechazadas por Motivo',
        align: 'center',
        style: {
          fontSize: '16px',
          fontWeight: 'bold'
        }
      },
      plotOptions: {
        pie: {
          donut: {
            size: '45%'
          }
        }
      },
      dataLabels: {
        enabled: true
      },
      legend: {
        position: 'right'
      }
    };
  }

  private updateChart(data: RechazadasPorMotivo[]): void {
    const colors = this.generateColors(data.length);

    this.chartOptions.series = data.map(item => item.cantidad);
    this.chartOptions.labels = data.map(item => item.motivo || 'Sin motivo');
    this.chartOptions.colors = colors;
  }

  private generateColors(count: number): string[] {
    const baseColors = [
      '#FF4560', '#00E396', '#008FFB', '#FEB019', '#775DD0',
      '#FF66C4', '#00D9E9', '#FFA07A', '#20B2AA', '#DEB887',
      '#5F9EA0', '#FF7F50', '#6495ED', '#DC143C', '#00FF7F'
    ];
    
    return count <= baseColors.length 
      ? baseColors.slice(0, count)
      : [...baseColors, ...this.generateAdditionalColors(count - baseColors.length)];
  }

  private generateAdditionalColors(count: number): string[] {
    const colors = [];
    for (let i = 0; i < count; i++) {
      const hue = Math.floor(Math.random() * 360);
      colors.push(`hsl(${hue}, 70%, 65%)`);
    }
    return colors;
  }
}