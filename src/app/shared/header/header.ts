import { Component } from '@angular/core';
import { Boton} from '../botones/boton/boton';
import { RouterLink} from '@angular/router';


@Component({
  selector: 'app-header',
  imports: [Boton, RouterLink],
  templateUrl: './header.html',
  styleUrl: './header.css'
})
export class Header {

}
