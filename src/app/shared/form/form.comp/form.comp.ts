import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Boton } from '../../botones/boton/boton';

@Component({
  selector: 'app-form-comp',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, Boton],
  templateUrl: './form.comp.html',
  styleUrls: ['./form.comp.css'],
})
export class FormComp {

  @Input() fields: any[] = [];
  @Input() disableSubmit: boolean = false;
  
  @Input() formGroup!: FormGroup; // ✅ Recibe el FormGroup desde el padre

  @Output() submitForm = new EventEmitter<any>();
  @Output() valueChanges = new EventEmitter<any>();

  // Nuevos inputs para configurar el botón
  @Input() showSubmitButton: boolean = true; // Mostrar/ocultar botón
  @Input() submitButtonText: string = 'Enviar'; // Texto del botón
  @Input() submitButtonIcon: string = 'fa fa-paper-plane'; // Icono del botón

  ngOnInit() {
    if (!this.formGroup) {
      console.error('❌ ERROR: Debes pasar un FormGroup desde el componente padre');
    } else {
      this.formGroup.valueChanges.subscribe(value => {
        this.valueChanges.emit(value);
      });
    }
  }

  onSubmit() {
    if (this.disableSubmit) return;
    if (this.formGroup && this.formGroup.valid) {
      this.submitForm.emit(this.formGroup.value);
    }
  }
}
