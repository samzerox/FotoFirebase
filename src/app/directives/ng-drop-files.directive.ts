import { Directive, EventEmitter, ElementRef,
          HostListener, Input, Output } from '@angular/core';
import { FileItem } from "../models/file-item";


// EventEmitter: manda informacion al padre de que hizo algo
// ElementRef: da la referencia al elemento html que esta usando esta directiva
// HostListener: con esto podemos adjuntarle eventos como DrawEnter, DrawLeave, DrawOver, DrawClick
// Input: pare recibir informacion que viene del padre
// Output: para mandarle informacion al padre, como variables y esas cosas

@Directive({
  selector: '[NgDropFiles]'
})
export class NgDropFilesDirective {

  @Input() archivos:FileItem[] = [];  //con esto recibimos los archivos que son un arreglo de FileItem,
                                      //o mejor dicho, crear la relacion entre padre e hijo con los archivos
  @Output() archivoSobre:EventEmitter<any> = new EventEmitter(); //esto manda cunado tenemos archivos o tenemos el cursos sobre la caja del dropZone

  constructor( public elemento:ElementRef ) {}

  @HostListener('dragenter',['$event'])
  public onDragEnter( event:any){
    this.archivoSobre.emit( true );
  }

  @HostListener('dragleave',['$event'])
  public onDragLeave( event:any){
    this.archivoSobre.emit( false );
  }

  @HostListener('dragover',['$event'])
  public onDragOver( event:any){

    let transferencia = this._getTrtansferencia( event );
    transferencia.dropEffect = 'copy';

    this._prevenirYdetener( event );

    this.archivoSobre.emit( true );
  }

  @HostListener('drop',['$event'])
  public onDrop( event:any){

    let transferencia = this._getTrtansferencia( event );
    if( !transferencia ){
        return ;
    }

    this._agregarArchivos( transferencia.files );

    this.archivoSobre.emit( false );

    this._prevenirYdetener( event );
  }

  //Verifica si hay informacion que enviar
  private _getTrtansferencia( event:any){
    return event.dataTransfer ? event.dataTransfer : event.originalEvent.dataTransfer;
  }

  private _agregarArchivos( archivosLista:FileList ){
      // console.log( archivosLista );

      for (let propiedad in Object.getOwnPropertyNames( archivosLista )) {
          let archtemporal = archivosLista[propiedad];

          if (this._archivoPuedeSerCargado( archtemporal )) {
              let nuevoArchivo = new FileItem( archtemporal )
              this.archivos.push( nuevoArchivo )
          }
      }

      console.log( this.archivos );
  }

//Esto evita que cuando sueltes un archivo el chrome lo abra
  private _prevenirYdetener( event:any ){
    event.preventDefault();
    event.stopPropagation();
  }

  private _archivoPuedeSerCargado( archivo:File ){
      if( !this._archivoYaFueDroppeado( archivo.name ) && this._esImagen( archivo.type ) ){
          return true;
      }

      return false;
  }

  //verifica que el archivo ya fue droppeado
  private _archivoYaFueDroppeado( nombreArchivo:string ):boolean{
      for( let i in this.archivos ){
          let arch = this.archivos[i];

          if( arch.archivo.name === nombreArchivo ){
              console.log("Archivo ya existe en la lista", nombreArchivo);
              return true;
          }
      }

      return false;
  }

  //restringe que solo sean imagenes
  private _esImagen( tipoArchivo:string):boolean{
     return ( tipoArchivo == '' || tipoArchivo == undefined )? false : tipoArchivo.startsWith("image");
  }


}
