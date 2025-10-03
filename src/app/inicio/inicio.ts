

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
  wasteTypes: WasteType[] = [
    { icon: '🗞️', name: 'Papel' },
    { icon: '🍾', name: 'Plástico' },
    { icon: '🥫', name: 'Metal' },
    { icon: '🍷', name: 'Vidrio' },
    { icon: '📦', name: 'Cartón' },
    { icon: '🔋', name: 'Baterías' },
    { icon: '💻', name: 'Electrónicos' },
    { icon: '👕', name: 'Textiles' },
  ];
}





