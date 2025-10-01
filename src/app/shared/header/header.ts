import { Component } from '@angular/core';
import { Boton} from '../botones/boton/boton';
import { RouterLink, RouterOutlet } from '@angular/router';


@Component({
  selector: 'app-header',
  imports: [Boton, RouterOutlet, RouterLink],
  templateUrl: './header.html',
  styleUrl: './header.css'
})
export class Header {

}
