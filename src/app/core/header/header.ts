import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, CommonModule],
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