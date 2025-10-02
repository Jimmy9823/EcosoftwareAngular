// src/app/usuario_models/usuario.model.ts
export interface UsuarioModel {
  idUsuario?: number;
  rolId: number;           // ID del rol (1 = admin, 2 = ciudadano, etc.)
  nombre: string;
  contrasena: string;
  correo: string;
  cedula: string;
  telefono: string;
  nit?: string;
  direccion?: string;
  barrio?: string;
  localidad?: string;
  zona_de_trabajo?: string;
  horario?: string;
  certificaciones?: string;
  imagen_perfil?: string;
  cantidad_minima?: number;
  estado?: boolean;
  fechaCreacion?: string;

  // Campos adicionales del front
  tipoMaterial?: string[];       // reciclador / empresa
  otrosMateriales?: string;      // reciclador / empresa
  representanteLegal?: string;   // empresa
  rol?: string
}
