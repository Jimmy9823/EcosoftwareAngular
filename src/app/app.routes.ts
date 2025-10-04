import { Routes } from '@angular/router';
import { Inicio } from './inicio/inicio';
import { Solcitudes } from './solcitudes/solcitudes';
import { Usuario } from './usuario/usuario_components/usuario';
import { Login } from './auth/login/login';
import { Registro } from './auth/registro/registro';
import { Administrador } from './usuario/administrador/administrador';
import { Ciudadano } from './usuario/ciudadano/ciudadano';
import { Empresa } from './usuario/empresa/empresa';

export const routes: Routes = [
    {path: '', component: Inicio},
    {path: 'solicitudes', component: Solcitudes},
    {path: 'usuarios', component: Usuario},
    {path: 'login', component:Login},
    {path: 'registro', component:Registro},
    {path: 'administrador', component:Administrador},
    {path: 'ciudadano', component:Ciudadano},
    { path: 'empresa', component:Empresa},
    {path: '**', redirectTo: ''} //cualquier otra ruta redirecciona a inicio
];

