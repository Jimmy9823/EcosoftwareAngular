export interface Capacitacion {
  id?: number;
  nombre: string;
  descripcion: string;
  numeroDeClases: string;
  duracion: string;
  imagen?: string;               // Lo agregamos porque está en la entidad
  modulos?: Modulo[];        // Relación con módulos si deseas traerlos
}

export enum EstadoCurso {
  Inscrito = 'Inscrito',
  Finalizado = 'Finalizado',
  En_Proceso = 'En_Proceso',
  Cancelado = 'Cancelado'
}

export interface Modulo{
  id?: number;
  duracion: string;
  descripcion: string;
  capacitacionId: number;        // Relación con Capacitacion
}

export interface Inscripcion {
  id?: number;
  fechaDeInscripcion: string;    // Angular maneja LocalDate como string
  estadoCurso: EstadoCurso;      // Importar enum
  cursoId: number;
  usuarioId: number;
}

export interface Progreso {
  id?: number;
  progresoDelCurso: string;
  modulosCompletados: string;
  tiempoInvertido: string;
  cursoId: number;
  usuarioId: number;
}
