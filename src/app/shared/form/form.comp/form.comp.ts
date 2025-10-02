import { Component, EventEmitter, Input, Output } from '@angular/core'
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms'
import { CommonModule } from '@angular/common'
import { COMPARTIR_IMPORTS } from '../../../ImpCondYForms/imports'  // 👈 Tu archivo central de imports

@Component({
  selector: 'app-form-comp',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule, COMPARTIR_IMPORTS],
  templateUrl: './form.comp.html',
  styleUrls: ['./form.comp.css']
})
export class FormComp {
  @Input() mode: 'login' | 'registro' | 'filtro' = 'login'
  @Output() formSubmit = new EventEmitter<any>()
  @Output() filterClear = new EventEmitter<void>()

  registroForm!: FormGroup
  loginForm!: FormGroup
  filtroForm!: FormGroup

  selectedRol: string = 'ciudadano'
  tiposMaterial: string[] = ['Papel', 'Plástico', 'Vidrio', 'Metales', 'Orgánicos', 'Otros']
  mostrarOtrosMateriales = false

  constructor(private fb: FormBuilder) {
    this.initForms()
  }

  private initForms() {
    // 📝 Registro base (para todos)
    this.registroForm = this.fb.group({
      rol: ['ciudadano', Validators.required],
      nombre: ['', Validators.required],
      cedula: ['', [Validators.required, Validators.pattern(/^\d+$/)]],
      correo: ['', [Validators.required, Validators.email]],
      telefono: ['', [Validators.required, Validators.pattern(/^\d{7,10}$/)]],
      contrasena: ['', [Validators.required, Validators.minLength(6)]],
      validarContrasena: ['', [Validators.required]],
      // Campos opcionales que activamos por rol
      direccion: [''],
      barrio: [''],
      localidad: [''],
      zonaTrabajo: [''],
      horarioTrabajo: [''],
      cantidadMinima: [''],
      tipoMaterial: [[]],
      otrosMateriales: [''],
      nit: [''],
      representanteLegal: [''],
      horario: ['']
    }, { validators: this.passwordMatchValidator })

    //  Login
    this.loginForm = this.fb.group({
      correo: ['', [Validators.required, Validators.email]],
      contrasena: ['', Validators.required]
    })
    //  Filtro
    this.filtroForm = this.fb.group({
      criterio: ['nombre'],
      valor: ['']
    })
  }

  // Validar contraseñas iguales
  private passwordMatchValidator(form: FormGroup) {
    const pass = form.get('contrasena')?.value
    const confirm = form.get('validarContrasena')?.value
    return pass === confirm ? null : { passwordMismatch: true }
  }

  // Cambiar rol dinámicamente
  onRolChange(event: Event) {
    const select = event.target as HTMLSelectElement
    this.selectedRol = select.value
  }

  onTipoMaterialChange(event: Event) {
    const checkbox = event.target as HTMLInputElement
    const value = checkbox.value
    const selected = this.registroForm.get('tipoMaterial')?.value || []

    if (checkbox.checked) {
      selected.push(value)
    } else {
      const idx = selected.indexOf(value)
      if (idx !== -1) selected.splice(idx, 1)
    }

    this.registroForm.get('tipoMaterial')?.setValue(selected)
    this.mostrarOtrosMateriales = selected.includes('Otros')
  }

  onSubmit() {
    let form: FormGroup
    switch (this.mode) {
      case 'login': form = this.loginForm; break
      case 'registro': form = this.registroForm; break
      case 'filtro': form = this.filtroForm; break
      default: return
    }

    if (form.valid) {
      this.formSubmit.emit(form.value)
    } else {
      form.markAllAsTouched()
    }
  }

  limpiarFiltro() {
    this.filtroForm.reset({ criterio: 'nombre', valor: '' })
    this.filterClear.emit()
  }

  isInvalid(form: FormGroup, controlName: string, error?: string) {
    const control = form.get(controlName)
    return control && control.touched && (error ? control.hasError(error) : control.invalid)
  }
}
