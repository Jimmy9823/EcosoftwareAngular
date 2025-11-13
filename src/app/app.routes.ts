import { Routes } from '@angular/router';
import { Inicio } from './pages/inicio/inicio';
import { Solcitudes } from './Logic/solicitudes-comp/listar-filtrar-solicitudes/solcitudes';
import { Usuario } from './Logic/usuarios.comp/listar-filtrar-usuarios/usuario';
import { Login } from './auth/login/login';
import { Registro } from './auth/registro/registro';
import { Administrador } from './pages/administrador/administrador';
import { Ciudadano } from './pages/ciudadano/ciudadano';
import { Empresa } from './pages/empresa/empresa';
import { CardsSolicitud } from './Logic/solicitudes-comp/cards-solicitud/cards-solicitud';
import { CardARSolicitud } from './Logic/solicitudes-comp/card-a-r-solicitud/card-a-r-solicitud';
import { FormRegistro } from './Logic/solicitudes-comp/vista-solicitudes/form-registro/form-registro';
import { EditarUsuario } from './Logic/usuarios.comp/editar-usuario/editar-usuario';
import { Error } from './core/error/error';
import { AuthGuard } from './auth/auth.guard'



export const routes: Routes = [
  { path: '', component: Inicio },
  { path: 'solicitudes', component: Solcitudes },
  { path: 'usuarios', component: Usuario },
  { path: 'registro', component: Registro },

  { path: 'login', component: Login},
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

