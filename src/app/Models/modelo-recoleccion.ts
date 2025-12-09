export interface ModeloRecoleccion {
  idRecoleccion: number;
  solicitudId: number;
  recolectorId?: number;
  rutaId?: number | null;   // puede venir null desde el backend

  estado: EstadoRecoleccion;
  fechaRecoleccion: string;            // LocalDateTime → se maneja como string en JSON
  observaciones: string;
  evidencia: string;
  fechaCreacionRecoleccion: string;    // OffsetDateTime → también string
}

export enum EstadoRecoleccion {
  Pendiente = 'Pendiente',
  En_Progreso = 'En_Progreso',
  Completada = 'Completada',
  Fallida = 'Fallida',
  Cancelada = 'Cancelada'
}

