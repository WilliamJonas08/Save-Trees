import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Component({
  selector: 'tree-icon',
  templateUrl: './tree-icon.component.html',
  styleUrls: ['./tree-icon.component.scss']
})
export class TreeIconComponent implements OnInit {

  iconSize: string //Defines the size of one icon
  location = new BehaviorSubject<{ X: string, Y: string }>({ X: '0px', Y: '0px' })
  // TODO: utiliser un pipe pour récupérer la data de location dans le template directement
  X: string
  Y: string

  private initialValue: number | null // value returned by the icon when "destroyed"
  value: number | null //Nombre d'abres que représente l'icone

  private probabilityToBeAxe: number = 0.15 // 0.1 / 1
  private timeAxeDisparition: number = 1000 //1s  //Mettre 1.5s ?
  iconIsAxe: boolean

  display: boolean = true

  @Output()
  touched = new EventEmitter<[number, boolean]>()

  // si on ajoute une fonctionnalité ou les icones s'autodétruisent
  // délai_restant

  ngOnInit() {
    this.iconSize="100px"
    if(window.innerWidth<567){
      this.iconSize=`${window.innerWidth/6}px`
    }
    this.location.subscribe((location) => {
      // On commence par définir si l'icon sera une hache (icon sur lequel le user ne doit pas cliquer)
      this.iconIsAxe = Math.random() <= this.probabilityToBeAxe
      if (this.iconIsAxe) {
        setTimeout(() => {
          this.display = false // duplicate false attribution pour le cacher le plus vite possible (rappellé dans le iconTouched)
          this.value = 1 // 1 permet d'avoir this.value ===0 
          // (on a déja this.initialValue===null donc le score ne sera pas incrémenté)
          this.iconIsAxe = false //Le axeIcon n'a pas encore été touché 
          this.iconTouched()
        }, this.timeAxeDisparition) //L'icone Axe disparait au bout de 1s
      }
      this.value = (this.iconIsAxe) ? null : Math.floor(1 + Math.random() * 3)
      this.initialValue = this.value
      this.X = location.X
      this.Y = location.Y
      this.display = true
    })
  }

  iconTouched() {
    this.value--
    if (this.value === 0 || this.iconIsAxe) { //si l'icone a été touché le bon nombre de fois OU si la hache a été touchée
      this.display = false
      // if (this.iconIsAxe) {console.log("AXE TOUCHED EMISSION")}
      this.touched.emit([this.initialValue, this.iconIsAxe])
      // On ne met pas simplement un timeout ici pour remettre display = true car il y a un décalage temporel visible
    }
  }

}
