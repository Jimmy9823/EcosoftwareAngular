

import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

import { Header } from '../shared/header/header';
import { Footer } from '../shared/footer/footer';

interface WasteType {
  icon: string;
  name: string;
}

interface EcoTip {
  iconClass: string;
  title: string;
  description: string;
}

interface NewsItem {
  iconClass: string;
  badgeClass: string;
  category: string;
  title: string;
  description: string;
  time: string;
}

@Component({
  selector: 'app-Inicio',
  standalone: true,
  imports: [CommonModule, RouterLink,Header,Footer],
  templateUrl: './inicio.html',
  styleUrl: './inicio.css'
})
export class Inicio {
  wasteTypes = [
    { name: 'Papeles y Cartones', icon: 'bi bi-file-earmark-text-fill icon-paper' },
    { name: 'Plásticos', icon: 'bi bi-bag-fill icon-plastic' },
    { name: 'Metales', icon: 'bi bi-box-seam-fill icon-metal' },
    { name: 'Vidrios', icon: 'bi bi-cup-straw icon-glass' },
    { name: 'Desechos Orgánicos', icon: 'bi bi-flower1 icon-organic' },
    { name: 'Otros Residuos', icon: 'bi bi-trash-fill icon-mixed' },
    { name: 'Residuos Peligrosos', icon: 'bi bi-exclamation-triangle-fill icon-hazard' },
    { name: 'Aparatos Eléctricos', icon: 'bi bi-cpu-fill icon-electronic' },
    { name: 'Textiles', icon: 'bi bi-bag-heart-fill icon-textile' }
  ];
}





