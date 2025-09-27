import { Routes } from '@angular/router';
import { Inicio } from './inicio/inicio';
import { Solcitudes } from './solcitudes/solcitudes';
import { Usuario } from './usuario/usuario_components/usuario';
import { Login } from './auth/login/login';
import { Registro } from './auth/registro/registro';

export const routes: Routes = [
    {path: '', component: Inicio},
    {path: 'solicitudes', component: Solcitudes},
    {path: 'usuarios', component: Usuario},
    {path: 'login', component:Login},
    {path: 'registarse', component:Registro},
    {path: '**', redirectTo: ''} //cualquier otra ruta redirecciona a inicio
];

