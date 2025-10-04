import { Routes } from '@angular/router';
import { Inicio } from './inicio/inicio';
import { Solcitudes } from './solcitudes/solcitudes';
import { Usuario } from './usuario/usuario_components/usuario';
import { Login } from './auth/login/login';
import { Registro } from './auth/registro/registro';
import { Administrador } from './usuario/administrador/administrador';
import { Ciudadano } from './usuario/ciudadano/ciudadano';
import {CardsSolicitud} from './solcitudes/cards-solicitud/cards-solicitud'
import {CardARSolicitud} from './solcitudes/card-a-r-solicitud/card-a-r-solicitud'

export const routes: Routes = [
    {path: '', component: Inicio},
    {path: 'solicitudes', component: Solcitudes},
    {path: 'usuarios', component: Usuario},
    {path: 'login', component:Login},
    {path: 'registro', component:Registro},
    {path: 'administrador', component:Administrador},
    {path: 'ciudadano', component:Ciudadano},
    {path: 'card-solicitudes', component:CardsSolicitud},
    {path: 'card-acep-rechazar', component:CardARSolicitud},
    
    {path: '**', redirectTo: ''} //cualquier otra ruta redirecciona a inicio
];

