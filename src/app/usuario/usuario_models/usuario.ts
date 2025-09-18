// usuario.model.ts
export interface UsuarioModel {
  idUsuario: number;
  rolId: number;
  nombre: string;
  contrasena: string;
  correo: string;
  cedula: string;
  telefono: string;
  nit?: string;
  direccion?: string;
  barrio: string;
  localidad: string;
  zona_de_trabajo?: string;
  horario?: string;
  certificaciones?: string;
  imagen_perfil?: string;
  cantidad_minima?: number;
  estado?: boolean;
  fechaCreacion?: string;
}

