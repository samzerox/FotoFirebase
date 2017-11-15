import { Component, OnInit } from '@angular/core';
import { CargaImagenesService } from '../../providers/carga-imagenes.service';
// import { FirebaseListObservable } from "angularfire2/database";
import { Observable } from 'rxjs/Observable';

@Component({
  selector: 'app-fotos',
  templateUrl: './fotos.component.html',
  styles: []
})
export class FotosComponent implements OnInit {

  imagenes: Observable<any[]>;

  constructor(public _cargaImagenes:CargaImagenesService) {
    this.imagenes = this._cargaImagenes.listaUltimasImagenes( 10 );
  }

  ngOnInit() {
  }

}
