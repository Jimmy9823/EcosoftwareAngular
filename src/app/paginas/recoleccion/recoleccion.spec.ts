import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Recoleccion } from './recoleccion';

describe('Recoleccion', () => {
  let component: Recoleccion;
  let fixture: ComponentFixture<Recoleccion>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Recoleccion]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Recoleccion);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
