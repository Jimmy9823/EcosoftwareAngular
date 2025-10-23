import { Routes } from '@angular/router';
import { Inicio } from './pages/inicio/inicio';
import { Solcitudes } from './solcitudes/solcitudes';
import { Usuario } from './usuario/usuario_components/usuario';
import { Login } from './auth/login/login';
import { Registro } from './auth/registro/registro';
import { Administrador } from './usuario/administrador/administrador';
import { Ciudadano } from './usuario/ciudadano/ciudadano';
import { Empresa } from './usuario/empresa/empresa';
import { CardsSolicitud } from './solcitudes/cards-solicitud/cards-solicitud';
import { CardARSolicitud } from './solcitudes/card-a-r-solicitud/card-a-r-solicitud';
import { FormRegistro } from './solcitudes/form-registro/form-registro';
import { EditarUsuario } from './usuario/editar-usuario/editar-usuario';
import { Error } from './core/error/error';
import { AuthGuard } from './auth/auth.guard'


export const routes: Routes = [
  { path: '', component: Inicio },
  { path: 'solicitudes', component: Solcitudes },
  { path: 'usuarios', component: Usuario },
  { path: 'login', component: Login},
  { path: 'registro', component: Registro },
  {
    path: 'administrador', component: Administrador,
    canActivate: [AuthGuard],  data: { rol: 'Administrador' }
  },
  {
    path: 'ciudadano', component: Ciudadano,
    canActivate: [AuthGuard],  data: { rol: 'Ciudadano' }
  },
  {
    path: 'empresa', component: Empresa,
    canActivate: [AuthGuard],  data: { rol: 'Empresa' }
  },
  { path: 'editar-usuario', component: EditarUsuario },
  { path: 'card-solicitud', component: CardsSolicitud },
  { path: 'card-re-acpt-solicitud', component: CardARSolicitud },
  { path: 'form-solicitud', component: FormRegistro },
  { path: '**', component: Error }
];

