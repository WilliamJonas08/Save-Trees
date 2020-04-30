import { Component, OnInit, ViewChild, ViewContainerRef, ComponentFactoryResolver, ChangeDetectorRef, ComponentRef, AfterContentInit, ComponentFactory } from '@angular/core';

import { TreeService } from 'src/activities/shared/services/tree/tree.service';

// On importe le child component pour pouvoir le créer dynamiquement avec une Factory
import { TreeIconComponent } from '../../components/tree-icon/tree-icon.component';


@Component({
  selector: 'app-tree',
  templateUrl: './tree.component.html',
  styleUrls: ['./tree.component.scss']
})
export class TreeComponent implements AfterContentInit {

  score: number = 0
  display : string = 'setup'// setup / plate / result (remplace le router outlet)

  // Paramètres à changer dynamiquement avec la taille de l'écran:
  private plate_width: number = 550 //en px et width=height (TODO)
  private treeIcon_size: number = 100 //px

  private treeIconIndexes = [0,1,2,3] //Définit le nombre d'icones présents en instantanné

  // Création dynamique du child component
  @ViewChild('iconRef', { read: ViewContainerRef }) iconRef: ViewContainerRef; // TODO read ?

  components: ComponentRef<TreeIconComponent>[] = [] //Array of our components
  treeIconFactory: ComponentFactory<TreeIconComponent>

  constructor(
    private resolver: ComponentFactoryResolver, // Create a componement factory based on our child component
    private cd: ChangeDetectorRef,
    private treeService: TreeService
  ) {
    // Création de la factory du TreeInconComponent
    this.treeIconFactory = this.resolver.resolveComponentFactory(TreeIconComponent) // Function that resolves the component
  }

  beginGame(){}

  // TODO : A appeller au lancement du jeu et non pas au lancement du container
  ngAfterContentInit(): void {
    setTimeout(() => {
      this.treeIconIndexes.forEach(index => { // TODOPossibilité de les faire apparaitre avec un décallage chacun

        this.components[index] = this.iconRef.createComponent(this.treeIconFactory)
        this.components[index].instance.touched.subscribe(() => {
          this.onIconTouched(index)
        })

        this.moveIcon(index)
      });
    })
    
  }

// TODO : ajouter un délai avant le renouvellement de chaque composant ?
// ajouter un paramètre hide et disbale la possibilité de click et de voir le pointer
  moveIcon(i: number) { 
    let component = this.components[i]

    // let component: ComponentRef<TreeIconComponent>
    // component = this.iconRef.createComponent(this.treeIconFactory) // Once we have the component's factory, we just create this component // 0 is the index to create a specific order of generation between these two components that have been generated
    
    const location =this.getRandomLocation(this.plate_width - this.treeIcon_size, i)
    component.instance.location = location

    // this.components[i] = component
    // console.log("component", i, "added",this.components)
    // this.components[i].instance.touched.subscribe(() => {
    //   this.onIconTouched(i)
    // })
    // component=undefined
  }

  onIconTouched(i: number) {
    this.score++
    // this.destroyIcon(i)
    this.moveIcon(i)
  }

  // TODO: une fois touché, on pourrait éventuellement uniquement bouger le composant plutot que de le détruire
  // destroyIcon(i: number) {
  //   this.components[i].destroy()
  //   console.log("component", i, "destroyed",this.components)

  // }

  getRandomLocation(max:number, index:number): { X: string, Y: string } {
    return { X: Math.floor(Math.random() * Math.floor(max)).toString() + 'px', Y: (Math.floor(Math.random() * Math.floor(max))-index*this.treeIcon_size).toString() + 'px' };
    // TODO : décalage vertical lié à la création de plusieurs TreeIconComponent (les div les repoussent vers le bas)
  }
}

// // PASS DYNAMIC DATA INTO COMPONENT : Modifying component properties (we don't have to set Input property in this component)
// this.component.instance.title = "Dynamically generated Child Component 2"

// this.cd.detectChanges() //Permet d'empecher l'affichage de l'erreur "modified after checked" et ainsi d'afficher les autres propriétés du composant (par exemple celle lées à #inputRef)