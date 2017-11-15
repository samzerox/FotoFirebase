import { Injectable } from '@angular/core';
import { AngularFireDatabase, FirebaseListObservable } from "angularfire2/database-deprecated";
import { Observable } from 'rxjs/Observable';
import { FileItem } from '../models/file-item';

import * as firebase from 'firebase';


@Injectable()
export class CargaImagenesService {

  private CARPETA_IMAGENES:string = 'img';
  constructor(public db:AngularFireDatabase) { }

  listaUltimasImagenes( numeroImagenes:number ):FirebaseListObservable<any[]>{

      return this.db.list(`/${ this.CARPETA_IMAGENES}`,{
        query:{
          limitToLast: numeroImagenes
        }
      })
  }

  cargar_imagenes_firebase(archivos: FileItem[]){
      console.log( archivos );

      //
      let storageRef = firebase.storage().ref();

      //barre todos los archivos para mandarlos a firebase uno por uno
      for (let item of archivos ) {
          item.estaSubiendo = true;

          //hace referencia a una tarea de carga de firebase
          let uploadTask:firebase.storage.UploadTask =
                      storageRef.child(`${ this.CARPETA_IMAGENES }/${ item.nombreArchivo}`)
                                  .put( item.archivo ); //esto es lo que se sube, no el FIleItem

          //Da informacion del estado de la subida, si lo logra, falla o da error y el estado
          uploadTask.on(firebase.storage.TaskEvent.STATE_CHANGED,
              //el estado de la subida
            (snapshot)=>item.progreso =  (uploadTask.snapshot.bytesTransferred / uploadTask.snapshot.totalBytes) * 100,
            (error) => console.error("Error al subir",error),
            ()=>{
              item.url = uploadTask.snapshot.downloadURL;
              item.estaSubiendo = false;
              this.guardarImagen( {nombre: item.nombreArchivo, url:item.url} );
              return undefined;
            }
          )
      }//fin del for
  }

  private guardarImagen( imagen:any ){
    this.db.list(`/${ this.CARPETA_IMAGENES}`).push( imagen );
  }

}
