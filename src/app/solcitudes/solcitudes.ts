import { UsuarioService } from './../usuario/usuario_services/usuario.service';
import { ServiceModel } from '../solicitudes/model';
import { Service } from './../solicitudes/service';
import { Component, OnInit } from '@angular/core';
import { COMPARTIR_IMPORTS } from '../ImpCondYForms/imports';
import { Header } from '../shared/header/header';

@Component({
  selector: 'app-solcitudes',
  imports: [COMPARTIR_IMPORTS,Header],
  templateUrl: './solcitudes.html',
  styleUrl: './solcitudes.css'
})
export class Solcitudes implements OnInit {

  Servicios: ServiceModel[] = []

  constructor(private solcitudesService: Service) {

  }

  ngOnInit(): void { this.listarSolicitudes() }

  listarSolicitudes(): void {
    this.solcitudesService.listar().subscribe({
      next: (lista: ServiceModel[]) => {
        this.Servicios = lista
      }
    })
  }
}
