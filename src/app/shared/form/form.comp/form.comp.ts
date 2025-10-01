// src/app/shared/form/form.comp.ts
import { Component, EventEmitter, Input, Output } from '@angular/core'
import { CommonModule } from '@angular/common'
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators, AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms'

@Component({
  selector: 'app-form-comp',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './form.comp.html',
  styleUrls: ['./form.comp.css']
})
export class FormComp {
  @Input() mode: 'registro' | 'login' | 'filtro' = 'registro'
  @Output() formSubmit = new EventEmitter<any>()

  registroForm!: FormGroup
  loginForm!: FormGroup
  filtroForm!: FormGroup

  selectedRol: 'ciudadano' | 'reciclador' | 'empresa' | 'admin' = 'ciudadano'
  tiposMaterial: string[] = ['Plástico', 'Papel', 'Cartón', 'Vidrio', 'Metal', 'Orgánico', 'Otros']
  mostrarOtrosMateriales: boolean = false

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.initForms()
  }

  // ===================== VALIDADORES PERSONALIZADOS =====================

  // ✅ Solo números + longitud entre 7 y 15
  cedulaValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const value = control.value
      if (!value) return null
      const regex = /^[0-9]+$/
      if (!regex.test(value)) return { numerosInvalidos: true }
      if (value.length < 7) return { minLength: true }
      if (value.length > 15) return { maxLength: true }
      return null
    }
  }

  // ✅ Teléfono entre 7 y 15
  telefonoValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const value = control.value
      if (!value) return null
      if (value.length < 7) return { minLength: true }
      if (value.length > 15) return { maxLength: true }
      return null
    }
  }

  // ✅ Contraseña compleja
  passwordValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const value = control.value || ''
      const errors: any = {}

      if (!/[a-z]/.test(value)) errors.missingLowercase = true
      if (!/[A-Z]/.test(value)) errors.missingUppercase = true
      if (!/[0-9]/.test(value)) errors.missingNumber = true
      if (!/[!@#$%^&*(),.?":{}|<>_\-]/.test(value)) errors.missingSpecial = true

      return Object.keys(errors).length ? errors : null
    }
  }

  // ✅ Confirmar contraseña igual
  matchPasswordValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      if (!this.registroForm) return null
      const password = this.registroForm.get('contrasena')?.value
      const confirm = control.value
      return password !== confirm ? { passwordsMismatch: true } : null
    }
  }

  // ===================== INICIALIZAR FORMULARIOS =====================
  private initForms() {
    this.registroForm = this.fb.group({
      rol: ['ciudadano'],
      nombre: [''],
      cedula: ['', [Validators.required, this.cedulaValidator()]],
      correo: ['', [Validators.required, Validators.email]],
      telefono: ['', [Validators.required, this.telefonoValidator()]],
      direccion: [''],
      barrio: [''],
      localidad: [''],
      contrasena: ['', [Validators.required, this.passwordValidator()]],
      validarContrasena: ['', [Validators.required, this.matchPasswordValidator()]], // 👈 Nuevo campo

      nit: [''],
      representanteLegal: [''],
      horario: [''],
      cantidadMinima: [''],
      tipoMaterial: [[]],
      otrosMateriales: [''],
      zonaTrabajo: [''],
      horarioTrabajo: ['']
    })

    this.loginForm = this.fb.group({
      correo: ['', [Validators.required, Validators.email]],
      contrasena: ['', Validators.required]
    })

    this.filtroForm = this.fb.group({
      criterio: ['correo'],
      valor: ['']
    })
  }

  // ===================== EVENTOS =====================

  onRolChange(event: any) {
    this.selectedRol = event.target.value
  }

  onTipoMaterialChange(event: any) {
    const value = event.target.value
    const checked = event.target.checked
    const materiales = this.registroForm.get('tipoMaterial')?.value || []
    if (checked) {
      materiales.push(value)
    } else {
      const index = materiales.indexOf(value)
      if (index >= 0) materiales.splice(index, 1)
    }
    this.registroForm.patchValue({ tipoMaterial: materiales })
    this.mostrarOtrosMateriales = materiales.includes('Otros')
  }

  onSubmit() {
    let data: any
    switch (this.mode) {
      case 'registro':
        data = { ...this.registroForm.value }
        delete data.validarContrasena // ❌ no enviamos esto al backend
        break
      case 'login':
        data = this.loginForm.value
        break
      case 'filtro':
        data = this.filtroForm.value
        break
    }
    this.formSubmit.emit(data)
  }

  // Helper para el HTML
  getErrorMessages(controlName: string): string[] {
    const control = this.registroForm.get(controlName)
    if (!control || !control.errors || !(control.dirty || control.touched)) return []

    const errors: string[] = []
    const e = control.errors

    if (e['required']) errors.push('Este campo es obligatorio.')
    if (e['numerosInvalidos']) errors.push('Solo se permiten valores numericos')
    if (e['minLength']) errors.push('El campo debe tener mínimo 7 caracteres.')
    if (e['maxLength']) errors.push('El campo puede tener máximo 15 caracteres.')
    if (e['email']) errors.push('correo no valido')
    if (e['missingLowercase']) errors.push('Debe contener al menos una minúscula.')
    if (e['missingUppercase']) errors.push('Debe contener al menos una mayúscula.')
    if (e['missingNumber']) errors.push('Debe contener al menos un número.')
    if (e['missingSpecial']) errors.push('Debe contener al menos un carácter especial.')
    if (e['passwordsMismatch']) errors.push('Las contraseñas no coinciden.')

    return errors
  }

  isFieldInvalid(form: FormGroup, field: string): boolean {
    const control = form.get(field)
    return !!(control && control.invalid && (control.dirty || control.touched))
  }
}
