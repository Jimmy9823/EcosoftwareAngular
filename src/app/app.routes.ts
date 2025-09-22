import { Routes } from '@angular/router';
import { Inicio } from './inicio/inicio';
import { Solcitudes } from './solcitudes/solcitudes';
import { Usuario } from './usuario/usuario_components/usuario';

export const routes: Routes = [
    {path: '', component: Inicio},
    {path: 'solicitudes', component: Solcitudes},
    {path: 'usuarios', component: Usuario}
];

