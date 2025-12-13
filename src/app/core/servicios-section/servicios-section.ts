import { Component } from '@angular/core';
import { AppRoutingModule } from "../../app-routing.module";

@Component({
  selector: 'app-servicios-section',
  imports: [AppRoutingModule],
  templateUrl: './servicios-section.html',
  styleUrl: './servicios-section.css'
})
export class ServiciosSection {




  constructor() { }

  ngOnInit(): void {
  }

  ngAfterViewInit(): void {
    this.setupScrollAnimation();
  }

  private setupScrollAnimation(): void {
    const observerOptions = {
      threshold: 0.2,
      rootMargin: '0px 0px -100px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
        }
      });
    }, observerOptions);

    const elements = document.querySelectorAll('[data-animate]');
    elements.forEach(el => {
      observer.observe(el);
    });
  }
}