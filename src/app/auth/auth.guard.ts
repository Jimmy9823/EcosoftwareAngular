import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from './auth.service';

export const AuthGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  //  Verificar si hay sesión
  if (!authService.isAuthenticated()) {
    console.warn('🚫 Usuario no autenticado');
    router.navigate(['/login']);
    return false;
  }

  //  Verificar rol, si la ruta lo requiere
  const rolRequerido = route.data?.['rol'];
  const rolUsuario = authService.getUserRole();

  if (rolRequerido && rolUsuario !== rolRequerido) {
    console.warn(` Acceso denegado: se requiere rol ${rolRequerido}`);
    router.navigate(['/login']);
    return false;
  }

  return true;
};
