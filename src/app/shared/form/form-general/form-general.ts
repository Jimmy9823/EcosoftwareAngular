import { Component, Output, Input, EventEmitter } from '@angular/core';
import { COMPARTIR_IMPORTS } from '../../../ImpCondYForms/imports';
import { FormGroup, FormControl } from '@angular/forms';
import { Boton } from '../../botones/boton/boton';

@Component({
  selector: 'app-form-general',
  imports: [COMPARTIR_IMPORTS, Boton],
  templateUrl: './form-general.html',
  styleUrl: './form-general.css'
})
export class FormGeneral {
@Input() fields: any[] = [];
@Output() submitForm = new EventEmitter<any>();
  formGroup!: FormGroup;

  ngOnInit() {
    const group: any = {};
    this.fields.forEach(field => {
      group[field.name] = new FormControl('');
    });
    this.formGroup = new FormGroup(group);
  }

  onSubmit() {
    this.submitForm.emit(this.formGroup.value);
  }
}
