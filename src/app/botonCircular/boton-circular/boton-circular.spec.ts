import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BotonCircular } from './boton-circular';

describe('BotonCircular', () => {
  let component: BotonCircular;
  let fixture: ComponentFixture<BotonCircular>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BotonCircular]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BotonCircular);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
