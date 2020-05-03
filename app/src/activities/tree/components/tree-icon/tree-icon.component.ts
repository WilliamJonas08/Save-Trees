import { Component, OnInit, Output, EventEmitter} from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Component({
  selector: 'tree-icon',
  templateUrl: './tree-icon.component.html',
  styleUrls: ['./tree-icon.component.scss']
})
export class TreeIconComponent implements OnInit {

  location = new BehaviorSubject<{ X: string, Y: string }>({ X: '0px', Y: '0px' })
  // TODO: utiliser un pipe pour récupérer la data de location dans le template directement
  X:string
  Y:string

  initialValue:number // value returned by the icon when "destructed"
  value:number //Nombre d'abres que représente l'icone

  display: boolean = true

  @Output()
  touched = new EventEmitter<number>()

  ngOnInit() {
    this.location.subscribe((location) => {
      this.value=Math.floor(1+Math.random() * 3)
      this.initialValue=this.value
      this.X=location.X
      this.Y=location.Y
      this.display = true
    })
  }


  // si on ajoute une fonctionnalité ou les icones s'autodétruisent
  // délai_restant

  iconTouched() {
    this.value--
    if (this.value===0){ //si l'icone a été touché le bon nombre de fois
      this.display = false
      // On ne met pas simplement un timeout ici pour remettre display = true car il y a un décalage temporel visible
      this.touched.emit(this.initialValue)
    }
  }


}
