import { Component, OnInit, AfterViewInit, Input, OnChanges, SimpleChanges } from '@angular/core';
import * as L from 'leaflet';
import { PuntoReciclaje } from '../../../Models/puntos-reciclaje.model';

@Component({
  selector: 'app-mapa',
  templateUrl: './mapa.html',
  styleUrls: ['./mapa.css']
})
export class Mapa implements OnInit, AfterViewInit, OnChanges {

  private map!: L.Map;
  @Input() puntos: PuntoReciclaje[] = [];

  ngOnInit(): void {}

  ngAfterViewInit(): void {
    this.inicializarMapa();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['puntos'] && this.map) {
      // Coercionar lat/lng a número y luego (re)dibujar marcadores
      this.puntos = (this.puntos || []).map(p => ({
        ...p,
        latitud: p.latitud !== null && p.latitud !== undefined ? parseFloat(String(p.latitud)) : null,
        longitud: p.longitud !== null && p.longitud !== undefined ? parseFloat(String(p.longitud)) : null
      }));
      this.agregarMarcadores();
    }
  }

  inicializarMapa(): void {
    this.map = L.map('mapa-id').setView([4.60971, -74.08175], 13); // Bogotá

    // Capa base
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '© OpenStreetMap'
    }).addTo(this.map);

    // Si ya vienen puntos, agregarlos
    if (this.puntos && this.puntos.length > 0) {
      this.puntos = this.puntos.map(p => ({
        ...p,
        latitud: p.latitud !== null && p.latitud !== undefined ? parseFloat(String(p.latitud)) : null,
        longitud: p.longitud !== null && p.longitud !== undefined ? parseFloat(String(p.longitud)) : null
      }));
      this.agregarMarcadores();
    }
  }

  agregarMarcadores(): void {
    this.puntos.forEach(punto => {
      if (punto.latitud && punto.longitud) {
        const marker = L.marker([punto.latitud, punto.longitud]).addTo(this.map);
        
        // Popup con información del punto
        marker.bindPopup(`
          <div>
            <h3>${punto.nombre}</h3>
            <p><strong>Dirección:</strong> ${punto.direccion}</p>
            <p><strong>Horario:</strong> ${punto.horario}</p>
            <p><strong>Residuos:</strong> ${punto.tipo_residuo}</p>
            ${punto.descripcion ? `<p>${punto.descripcion}</p>` : ''}
          </div>
        `);
      }
    });

    // Ajustar el mapa para mostrar todos los puntos
    if (this.puntos.length > 0) {
      const bounds = L.latLngBounds(
        this.puntos
          .filter(p => p.latitud && p.longitud)
          .map(p => [p.latitud, p.longitud] as [number, number])
      );
      this.map.fitBounds(bounds, { padding: [50, 50] });
    }
  }
}
