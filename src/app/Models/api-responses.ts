export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

export interface AuthResponse {
  token: string;
  refreshToken?: string;
  expiresIn: number;
  usuario: {
    id: number;
    nombre: string;
    rol: string;
    // ...otros campos
  };
}
