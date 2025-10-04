import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Localidad, EstadoPeticion, TipoResiduo, ServiceModel } from '../solcitudes/model';
import { Service } from '../solcitudes/solicitudes/service';
import { COMPARTIR_IMPORTS } from '../../ImpCondYForms/imports';

@Component({
  selector: 'app-form-registro',
  templateUrl: './form-registro.html',
  imports: [COMPARTIR_IMPORTS],
  styleUrls: ['./form-registro.css']
})
export class FormRegistro {

  registroForm: FormGroup;
  tiposResiduo = Object.values(TipoResiduo);
  localidades = Object.values(Localidad);
  mensaje = '';
  error = '';

  constructor(private fb: FormBuilder, private solicitudService: Service) {

    this.registroForm = this.fb.group({
      usuarioId: [{ value: 3, disabled: true }], // ⚡ ID fijo para prueba
      aceptadaPorId: [{ value: null, disabled: true }], // se asigna luego al aceptar
      tipoResiduo: ['', Validators.required],
      cantidad: ['', Validators.required],
      estadoPeticion: [{ value: EstadoPeticion.Pendiente, disabled: true }],
      descripcion: ['', Validators.required],
      localidad: ['', Validators.required],
      ubicacion: ['', Validators.required],
      evidencia: [''],
      fechaProgramada: ['', Validators.required]
    });
  }

  onSubmit(): void {
    if (this.registroForm.invalid) {
      this.mensaje = '';
      this.error = 'Por favor complete todos los campos obligatorios';
      return;
    }

    const raw = this.registroForm.getRawValue();

    // ⚡ Ya no hace falta validar usuarioId porque ahora siempre es 3
    const fechaProgramada = raw.fechaProgramada.includes('T')
      ? raw.fechaProgramada
      : raw.fechaProgramada + 'T00:00:00';

    const nuevaSolicitud: Partial<ServiceModel> = {
      usuarioId: raw.usuarioId,
      aceptadaPorId: null, // puede ser null al crear
      tipoResiduo: raw.tipoResiduo as TipoResiduo,
      cantidad: raw.cantidad,
      estadoPeticion: EstadoPeticion.Pendiente,
      descripcion: raw.descripcion,
      localidad: raw.localidad as Localidad,
      ubicacion: raw.ubicacion,
      evidencia: raw.evidencia && raw.evidencia.trim() !== '' ? raw.evidencia : 'Sin evidencia',
      fechaCreacionSolicitud: new Date().toISOString(),
      fechaProgramada: fechaProgramada
    };

    this.solicitudService.crearSolicitud(nuevaSolicitud as ServiceModel).subscribe({
      next: () => {
        this.mensaje = 'Solicitud registrada correctamente';
        this.error = '';
        this.registroForm.reset();
      },
      error: (err) => {
        this.mensaje = '';
        this.error = 'Error al registrar la solicitud: ' + (err.error?.message || err.message || 'Servidor');
      }
    });
  }
}
