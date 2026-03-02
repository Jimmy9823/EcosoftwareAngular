import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { UsuarioService } from '../../Services/usuario.service';
import { FormsModule } from '@angular/forms'; 

@Component({
  selector: 'app-subir-documentos',
  imports: [FormsModule],
  standalone: true,

  templateUrl: './subir-documentos.html',
  styleUrl: './subir-documentos.css',
})
export class SubirDocumentos {
  idUsuario!: number;
  archivo!: File;
  tipo: string = '';

  constructor(
    private route: ActivatedRoute,
    private usuarioService: UsuarioService
  ) {
    this.idUsuario = Number(this.route.snapshot.paramMap.get('id'));
  }

  seleccionarArchivo(event: any) {
    this.archivo = event.target.files[0];
  }

  subir() {

    if (!this.archivo || !this.tipo) {
      alert('Debes seleccionar archivo y tipo');
      return;
    }

    this.usuarioService.subirDocumento(this.idUsuario, this.archivo, this.tipo)
      .subscribe({
        next: () => {
          alert('Documento subido correctamente');
        },
        error: () => {
          alert('Error al subir documento');
        }
      });
  }
}
