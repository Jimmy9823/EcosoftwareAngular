import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Localidad, TipoResiduo, EstadoPeticion, ServiceModel } from '../solicitudes/model';
import { Service } from '../solicitudes/service';
import { COMPARTIR_IMPORTS } from '../../ImpCondYForms/imports';

@Component({
  selector: 'app-form-registro',
  templateUrl: './form-registro.html',
  styleUrls: ['./form-registro.css'],
  imports:[COMPARTIR_IMPORTS]
})
export class FormRegistro implements OnInit {

  registroForm!: FormGroup;
  localidades = Object.values(Localidad);
  tiposResiduo = Object.values(TipoResiduo).filter(t => t !== 'Otro'); // Excluir 'Otro'

  constructor(private fb: FormBuilder, private solicitudesService: Service) {}

  ngOnInit(): void {
    this.registroForm = this.fb.group({
      usuarioId: ['', Validators.required],
      tipoResiduo: ['', Validators.required],
      cantidad: ['', [Validators.required, Validators.pattern(/^\d+$/)]],
      descripcion: ['', Validators.required],
      localidad: ['', Validators.required],
      ubicacion: ['', Validators.required],
      evidencia: [''],
      fechaProgramada: ['', Validators.required],
      estadoPeticion: [{ value: EstadoPeticion.Pendiente, disabled: true }]
    });
  }

  onSubmit(): void {
    if (this.registroForm.valid) {
      const nuevaSolicitud: ServiceModel = {
        ...this.registroForm.value,
        idSolicitud: 0,
        aceptadaPorId: 0,
        fechaCreacionSolicitud: new Date().toISOString(),
        recoleccionId: 0,
        estadoPeticion: EstadoPeticion.Pendiente
      };
      this.solicitudesService.crearSolicitud(nuevaSolicitud).subscribe({
        next: () => alert('Solicitud registrada correctamente'),
        error: () => alert('Error al registrar solicitud')
      });
    } else {
      this.registroForm.markAllAsTouched();
    }
  }

  isInvalid(controlName: string): boolean {
    const control = this.registroForm.get(controlName);
    return !!(control && control.invalid && (control.dirty || control.touched));
  }
}
