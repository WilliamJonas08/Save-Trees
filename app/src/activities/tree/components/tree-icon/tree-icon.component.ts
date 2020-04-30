import { Component, OnInit, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'tree-icon',
  templateUrl: './tree-icon.component.html',
  styleUrls: ['./tree-icon.component.scss']
})
export class TreeIconComponent{

  location: { X: string, Y: string }= {X:'0px',Y:'0px'}

  @Output()
  touched = new EventEmitter<boolean>()


  // si on ajoute une fonctionnalité ou les icones s'autodétruisent

  // délai_restant

  // @Output()
  // autodestroyed

  iconTouched() {
    this.touched.emit()
  }


}
