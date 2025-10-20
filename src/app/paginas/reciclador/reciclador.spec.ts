import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Reciclador } from './reciclador';

describe('Reciclador', () => {
  let component: Reciclador;
  let fixture: ComponentFixture<Reciclador>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Reciclador]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Reciclador);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
