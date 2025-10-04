import { TestBed } from '@angular/core/testing';

import { ServicioRecoleccion } from './servicio-recoleccion';

describe('ServicioRecoleccion', () => {
  let service: ServicioRecoleccion;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ServicioRecoleccion);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
