import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Boton } from "../../shared/botones/boton/boton";

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, CommonModule, Boton],
  templateUrl: './header.html',
  styleUrls: ['./header.css']
})
export class Header {
  
 onProfileClick(): void {
    console.log('Profile clicked');
  }

  onLogoutClick(): void {
    console.log('Logout clicked');
    // Aquí va tu lógica de cerrar sesión
  }
}