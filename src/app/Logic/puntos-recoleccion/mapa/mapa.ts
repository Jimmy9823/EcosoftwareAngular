import { Component, OnInit, AfterViewInit } from '@angular/core';
import * as L from 'leaflet';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-mapa',
  templateUrl: './mapa.html',
  styleUrls: ['./mapa.css']
})
export class Mapa implements OnInit, AfterViewInit {

  private map!: L.Map;

  mapUrl: SafeResourceUrl;

  constructor(private sanitizer: DomSanitizer) {
    // IMPORTANTE: Sanitizar URL para que Angular deje cargarla
    this.mapUrl = this.sanitizer.bypassSecurityTrustResourceUrl(
      'http://localhost/AQUI%20ES/Eco_Software-/views/PuntosReciclaje.php'
    );
  }

  ngOnInit(): void {
  }

  ngAfterViewInit(): void {
    this.inicializarMapa();
  }

  inicializarMapa(): void {
    this.map = L.map('mapa-id').setView([4.60971, -74.08175], 13); // Bogotá

    // Capa base
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '© OpenStreetMap'
    }).addTo(this.map);

    // Marcador inicial
    const marker = L.marker([4.60971, -74.08175]).addTo(this.map);
    marker.bindPopup('¡Hola! Leaflet está funcionando.').openPopup();
  }
}
