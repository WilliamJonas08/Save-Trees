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

  display: boolean = true

  @Output()
  touched = new EventEmitter<boolean>()

  ngOnInit() {
    this.location.subscribe((location) => {
      this.X=location.X
      this.Y=location.Y
      this.display = true
    })
  }


  // si on ajoute une fonctionnalité ou les icones s'autodétruisent
  // délai_restant

  iconTouched() {
    this.display = false
    // On ne met pas simplement un timeout ici pour remettre display = true car il y a un décalage temporel visible
    this.touched.emit()
  }


}
