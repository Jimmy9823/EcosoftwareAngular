// src/app/enums/localidad.enum.ts

export enum Localidad {
  Usaquen = 'Usaquen',
  Chapinero = 'Chapinero',
  Santa_Fe = 'Santa_Fe',
  San_Cristobal = 'San_Cristobal',
  Usme = 'Usme',
  Tunjuelito = 'Tunjuelito',
  Bosa = 'Bosa',
  Kennedy = 'Kennedy',
  Fontibon = 'Fontibon',
  Engativa = 'Engativa',
  Suba = 'Suba',
  Barrios_Unidos = 'Barrios_Unidos',
  Teusaquillo = 'Teusaquillo',
  Los_Martires = 'Los_Martires',
  Antonio_Nariño = 'Antonio_Nariño',
  Puente_Aranda = 'Puente_Aranda',
  Candelaria = 'Candelaria',
  Rafael_Uribe_Uribe = 'Rafael_Uribe_Uribe',
  Ciudad_Bolivar = 'Ciudad_Bolivar',
  Sumapaz = 'Sumapaz'
}

export enum EstadoPeticion {
  Pendiente = 'Pendiente',
  Aceptada = 'Aceptada',
  Cancelada = 'Cancelada',
  Rechazada = 'Rechazada'
}


export enum TipoResiduo {
  Plastico = 'Plastico',
  Papel = 'Papel',
  Vidrio = 'Vidrio',
  Metal = 'Metal',
  Organico = 'Organico',
  Electronico = 'Electronico',
  Otro = 'Otro'
}





export interface ServiceModel {
  idSolicitud: number;
  usuarioId: number;          // Id del ciudadano que crea la solicitud
  aceptadaPorId: number;      // Id del usuario que acepta la solicitud (empresa/reciclador)

  tipoResiduo: TipoResiduo;
  cantidad: string;
  estadoPeticion: EstadoPeticion;
  descripcion: string;
  localidad: Localidad;
  ubicacion: string;
  evidencia: string;
  fechaCreacionSolicitud: string; // en Angular, OffsetDateTime llega como string ISO
  fechaProgramada: string;        // igual, se maneja como string ISO y se parsea a Date si se requiere

  recoleccionId: number;          // Relación con la recolección generada
}

