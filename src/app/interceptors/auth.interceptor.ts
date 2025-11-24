import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { UsuarioService } from '../Services/usuario.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(private usuarioService: UsuarioService) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const token = localStorage.getItem('token');
    let authReq = req;

    if (token) {
      authReq = req.clone({
        setHeaders: { Authorization: `Bearer ${token}` }
      });
    }

    if (this.usuarioService.isTokenExpired()) {
      this.usuarioService.logout();
      // Opcional: redirigir al login
    }

    return next.handle(authReq).pipe(
      catchError((error: HttpErrorResponse) => {
        if (error.status === 401) {
          this.usuarioService.prepareRefreshToken();
        }
        return throwError(() => error);
      })
    );
  }
}
