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

  @Input() formGroup!: FormGroup;
  @Input() fields: any[] = [];

  @Input() showSubmitButton: boolean = true;
  @Input() submitButtonText: string = 'Guardar';
  @Input() submitButtonColor: string = 'verde';
  @Input() submitButtonSize: string = 'md';
  @Input() submitButtonIcon: string | undefined;
  @Input() submitButtonHoverColor: string = 'verde-claro';

  @Output() formSubmit = new EventEmitter<any>();

  onSubmit() {
    if (this.formGroup.valid) {
      this.formSubmit.emit(this.formGroup.value);
    } else {
      this.formGroup.markAllAsTouched();
    }
  }
}
