import { Component, EventEmitter, Input, Output } from '@angular/core';
import { COMPARTIR_IMPORTS } from '../../../ImpCondYForms/imports'
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

function validarContrasena(control: any) {
  const value = control.value
  if (!value) return null
  const tieneMayuscula = /[A-Z]/.test(value)
  const tieneNumero = /\d/.test(value)
  const caracterEspecial = /[@$!%*?&]/.test(value)
  return tieneMayuscula && tieneNumero && caracterEspecial ? null : {
    contraseñaSegura: true
  }
}

function contraseñasCoinciden(group: FormGroup) {
  const pass = group.get('contrasena')?.value
  const confirmar = group.get('confirmarContraseña')?.value
  return pass === confirmar ? null : { noCoinciden: true }
}

@Component({
  selector: 'app-form-comp',
  standalone: true,
  imports: [COMPARTIR_IMPORTS],
  templateUrl: './form.comp.html',
  styleUrl: './form.comp.css'
})

export class FormComp {
  @Input() mode: 'login' | 'registro' | 'recuperar' = 'login'
  @Output() formSubmit = new EventEmitter<any>()

  form!: FormGroup
  roles = [
  { id: 1, label: 'Ciudadano' },
  { id: 2, label: 'Empresa' },
  { id: 3, label: 'Reciclador' },
  { id: 4, label: 'Administrador' }
];

  constructor(private fb: FormBuilder) { }

  ngOnInit() {
    if (this.mode === 'login') {
      this.form = this.fb.group({
        correo: ['', [Validators.required, Validators.email]],
        contrasena: ['', [Validators.required, Validators.minLength(6)]]
      })
    }
  

  if (this.mode === 'registro') {
  this.form = this.fb.group({
    rol: [1, Validators.required],
    nombre: ['', [Validators.required, Validators.minLength(3)]],
    correo: ['', [Validators.required, Validators.email]],
    telefono: ['', [Validators.required, Validators.pattern(/^[0-9]{10}$/)]],
    cedula: ['', [Validators.minLength(9)]],
    contrasena: ['', [Validators.required]],
    confirmarContraseña: ['', Validators.required],
    barrio: ['', Validators.required],
    localidad: ['', Validators.required],
    horario: [''],
    certificaciones: [''],
    imagen_perfil: [null],
    cantidad_minima: [''],
    zona_de_trabajo: [''],
    nit: ['', [Validators.minLength(7)]],
  }, { validators: contraseñasCoinciden });
}


if (this.mode === 'recuperar') {
  this.form = this.fb.group({
    correo: ['', [Validators.required, Validators.email]]
  })
}
  }
onSubmit() {
  if (this.form.valid) {
    this.formSubmit.emit({
      nombre: this.form.value.nombre,
      correo: this.form.value.correo,
      contrasena: this.form.value.contrasena,
      rolId: this.form.value.rol,   // aquí mapeas rol -> rolId
      telefono: this.form.value.telefono,
      cedula: this.form.value.cedula,
      barrio: this.form.value.barrio,
      localidad: this.form.value.localidad,
      horario: this.form.value.horario,
      certificaciones: this.form.value.certificaciones,
      imagen_perfil: this.form.value.imagen_perfil,
      cantidad_minima: this.form.value.cantidad_minima,
      zona_de_trabajo: this.form.value.zona_de_trabajo,
      nit: this.form.value.nit
    });
  } else {
    this.form.markAllAsTouched();
  }
}
get f(){
  return this.form.controls
}
}
