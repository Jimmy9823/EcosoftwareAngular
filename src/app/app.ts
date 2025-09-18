import { Component, OnInit, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Usuario } from "./usuario/usuario"; //  IMPORTAR

@Component({
  selector: 'app-root',
  standalone: true, //  Asegura que esté como standalone
  imports: [RouterOutlet, CommonModule, Usuario], //  Agrega CommonModule aquí
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App implements OnInit {
  protected readonly title = signal('EscosoftwareAngular');

  modoOscuroActivo: boolean = true;

  ngOnInit() {
    document.body.classList.add('modo-oscuro');
  }

  alternarModo() {
    this.modoOscuroActivo = !this.modoOscuroActivo;

    if (this.modoOscuroActivo) {
      document.body.classList.add('modo-oscuro');
      document.body.classList.remove('modo-claro');
    } else {
      document.body.classList.add('modo-claro');
      document.body.classList.remove('modo-oscuro');
    }
  }
}
