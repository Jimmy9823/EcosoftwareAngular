import { Component, Output, Input, EventEmitter, OnInit } from '@angular/core';
import { COMPARTIR_IMPORTS } from '../../../ImpCondYForms/imports';
import { FormGroup, FormControl } from '@angular/forms';
import { Boton } from '../../botones/boton/boton';

@Component({
  selector: 'app-form-general',
  imports: [COMPARTIR_IMPORTS, Boton],
  standalone: true,
  templateUrl: './form-general.html',
  styleUrl: './form-general.css'
})
export class FormGeneral implements OnInit {
  @Input() fields: any[] = [];
  @Output() submitForm = new EventEmitter<any>();

  /** Evento opcional para notificar cambios en campos (como el rol) */
  @Output() fieldChange = new EventEmitter<{ name: string; value: any }>();

  formGroup!: FormGroup;

  ngOnInit() {
    this.generarFormulario();
  }

  /** Permite regenerar el formulario si cambian los campos desde el padre */
  ngOnChanges() {
    if (this.fields && this.fields.length) {
      this.generarFormulario();
    }
  }

  private generarFormulario() {
    const group: any = {};
    this.fields.forEach(field => {
      group[field.name] = new FormControl('');
    });
    this.formGroup = new FormGroup(group);

    // Escucha cambios en el campo "rol" para notificar al padre
    if (this.formGroup.get('rol')) {
      this.formGroup.get('rol')!.valueChanges.subscribe(value => {
        this.fieldChange.emit({ name: 'rol', value });
      });
    }
  }

  onSubmit() {
    this.submitForm.emit(this.formGroup.value);
  }
}
