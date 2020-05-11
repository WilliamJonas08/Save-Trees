import { Component, ViewChild, ViewContainerRef, ComponentFactoryResolver, ComponentRef, ComponentFactory, OnInit } from '@angular/core';
import { switchMap } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { Router } from '@angular/router';

import { TreeService, GameParameters, Result, databaseResult } from 'src/activities/shared/services/tree/tree.service';
import { Store } from 'src/store';

// On importe le child component pour pouvoir le créer dynamiquement avec une Factory
import { TreeIconComponent } from '../../components/tree-icon/tree-icon.component';
import { User } from 'src/auth/shared/services/auth.service';

import { trigger, state, style, animate, transition, keyframes } from '@angular/animations';


@Component({
  selector: 'app-tree',
  templateUrl: './tree.component.html',
  styleUrls: ['./tree.component.scss'],
  animations: [
    trigger('comboBorderBottomPulse', [
      state('false', style({ borderColor: '*' })),
      state('true', style({ borderColor: 'blue' })),
      transition('false <=> true', [animate('5s', keyframes([
        style({ borderBottomColor: 'red' }),
        style({ borderBottomColor: 'black' }),
        style({ borderBottomColor: 'green' })
      ]))]),
      // useAnimation(transAnimation, {
      //   params: {
      //     height: 0,
      //     opacity: 1,
      //     backgroundColor: 'red',
      //     time: '1s'
      //   }
      // })
    ]),
    trigger('comboBorderPulse', [
      // state('false', style({ borderColor:'*'})),
      // state('true', style({ borderColor:'orange' })),
      transition('false <=> true', [animate('0.5s', keyframes([
        style({ borderColor: 'orange' }),
        style({ borderColor: 'black' }),
        style({ borderColor: 'orange' })
      ]))]),
    ]),
  ],
})
export class TreeComponent implements OnInit {

  result: Result = { game: 'tree', difficulty: 'easy', score: 0 }
  displayCountdown: boolean = false // setup / countdown / plate / result (remplace le router outlet)
  countdown: number //Décompte initial du jeu

  timeCounter: number = 0 //Barre de temps qui définit la fin du jeu si elle tombe à 0
  gameTimeCounter: number //Définit le temps de jeu à l'intant t (incrémenté à chaque seconde du jeu)
  // gameTime: number = 10000 //Définit la durée totale du jeu (dans le cas ou le jeu est limité dans le temps) //PAS ENCORE LE CAS

  axeTouchedSubject = new Subject<any>()//avertit les components que une hache a été touchée
  mistakeMode: boolean = false //indique si une hache a été touchée
  comboCounter: number = 0 //Indique le nombre de clicks réussis d'affilée par le user 
  fireMode: boolean //= this.comboCounter >=10
  comboEventTargetState: boolean = false
  comboEventTargetState2: boolean = false

  // Paramètres à changer dynamiquement avec la taille de l'écran:
  private plateSize: { width: number, height: number }  //en px et width=height (TODO)
  private treeIconSize: number  //px  =plateSize.width/10
  private gameBordersWidth: number = 12  //uniquement la largeur de la bordure de la class "game"
  private gameContainerBordersWidth: number = 0 //uniquement dans le cas d'un téléphone
  private counterHeight: number = 0

  @ViewChild('iconRef', { read: ViewContainerRef }) iconRef: ViewContainerRef;// Création dynamique du child component
  components: ComponentRef<TreeIconComponent>[] = [] //Array of our components
  treeIconFactory: ComponentFactory<TreeIconComponent>

  constructor(
    private resolver: ComponentFactoryResolver /* Create a componement factory based on our child component*/, private store: Store, private treeService: TreeService, private router: Router) { this.treeIconFactory = this.resolver.resolveComponentFactory(TreeIconComponent) }    // Création de la factory du TreeInconComponent

  ngOnInit() {
    this.axeTouchedSubject.subscribe(() => {
      this.mistakeMode = true
      setTimeout(() => this.mistakeMode = false, 1000) //Durée d'affichage de l'alerte rouge
    })
    
    const difficulty: string = this.store.value.difficulty
    // Définition taille plateau
    this.plateSize = { width: 550, height: 550 }
    this.treeIconSize = 100
    if (window.innerWidth <= 567) {
      this.plateSize = { width: window.innerWidth, height: window.innerHeight }
      this.treeIconSize = this.plateSize.width / 6
      this.gameContainerBordersWidth = 2 * 8 //dans le cas d'un téléphone window.innerWidth prend en compte les autres bordures que celle de "game" et donc celles de "game-container"
      // TODO : a mettre en % ?
      this.counterHeight = 70 //cas tel, la hauteur du compteur est prise en compte dans la hauteur de l'écran
    }
    this.beginGame(difficulty)
  }

  beginGame(difficulty: string) {
    // TODO : enable custom params
    // Définition des paramètres du jeu
    this.displayCountdown = true
    this.resetGameData()
    const gameParameters: GameParameters = this.treeService.getGameParameters(difficulty)
    this.result.difficulty = gameParameters.difficulty


    // TODO : changer le coef en fonction de la difficulté ? juste gagner moins ?


    const timeCoefficient: number = gameParameters.difficulty === "easy" ? 0.1 : gameParameters.difficulty === "moderate" ? 0.2 : 0.3
    // Délai avant le début du jeu (5s)
    let countdownInterval = setInterval(() => this.countdown--, 1000)//Toutes les secondes on incrémente le countdown
    setTimeout(() => {
      clearInterval(countdownInterval) //Décompte stoppé au bout de 5secondes
      this.displayCountdown = false
      let index = 0
      let gameTimeCounterInterval = setInterval(() => { this.gameTimeCounter++ }, 1000)
      let timeCounterInterval = setInterval(() => {
        this.timeCounter = this.timeCounter - timeCoefficient * Math.sqrt(Math.sqrt(this.gameTimeCounter)) //timeCounter (barre) diminue de plus en plus vite avec le temps de jeu
        if (this.timeCounter < 0) { this.endGame([timeCounterInterval, gameTimeCounterInterval]) } //FIN DU JEU
      }, 50)
      let instantiationInterval = setInterval(() => { //Crée des composants jusqu'à ce qu'il soit stoppé par le timeout suivant
        this.instanciateOneIcon(index, gameParameters.speed);
        index++
      }, gameParameters.speed)
      setTimeout(() => { clearInterval(instantiationInterval) }, gameParameters.speed * gameParameters.iconsNumber) //Stoppe la création des composants
      //Timeout pour déterminer la fin du jeu (DANS LE CAS D'UN JEU DE TEMPS DÉTERMINÉ)
      // setTimeout(() => {this.endGame()}, this.gameTime)
    }, this.countdown * 1000)
  }

  private resetGameData() {
    this.result.score = 0
    this.countdown = 3
    this.timeCounter = 100
    this.gameTimeCounter = 1
    this.comboCounter = 0
  }

  private instanciateOneIcon(index: number, speed: number) { //Création des components
    this.components[index] = this.iconRef.createComponent(this.treeIconFactory)
    this.moveIcon(index)
    this.components[index].instance.touched.subscribe((iconData) => { this.onIconTouched(iconData, index, speed) })
  }

  private moveIcon(i: number) {
    this.components[i].instance.location.next(this.getRandomLocation(this.plateSize.width - this.treeIconSize - this.gameContainerBordersWidth, this.plateSize.height - this.treeIconSize - this.gameContainerBordersWidth - this.counterHeight))
  }

  private onIconTouched(iconData: [number, boolean], i: number, delay: number) {
    const [iconValue, iconIsAxe] = iconData
    if (!iconIsAxe && iconValue !== null) { //Si l'icone touché n'est pas une hache
      this.result.score = this.result.score + (this.fireMode ? 2 * iconValue : iconValue) //LE JOUEUR GAGNE PLUS DE POINTS EN FIREMODE 
      // TODO : plus de points ou plus de temps ?
      this.comboCounter++
      this.fireMode = this.comboCounter >= 10
      // TODO : variation de couleur sous forme d'inpulsions en mode fire ?
      this.timeCounter = this.timeCounter + 5 //mettre boolean dans icontouched pour savoir si ça remonte + la barre de temps que la normale en fonction de la difficulté ?
      if (this.timeCounter > 100) {
        this.timeCounter = 100
      }
    }
    if (iconIsAxe) { // Si l'icon touché est une hache
      this.timeCounter = this.timeCounter - 5 // PÉNALITÉ pour avoir cliqué sur une hache
      this.restartCombo()
      this.axeTouchedSubject.next()
    }
    setTimeout(() => { this.moveIcon(i) }, delay)
  }

  restartCombo() { //réinitialise le conteur de combo lorsque le user touche le plateau ou une hache
    this.comboCounter = 0
    this.fireMode = false
    this.comboEventTargetState = true //Prépare le prochain combo
  }

  private getRandomLocation(maxWidth: number, maxHeight: number): { X: string, Y: string } {
    // console.log(maxWidth,maxHeight)
    return { X: Math.floor(Math.random() * Math.floor(maxWidth) - this.gameBordersWidth).toString() + 'px', Y: (Math.floor(Math.random() * Math.floor(maxHeight) - this.gameBordersWidth)).toString() + 'px' };
  }

  private async endGame(intervals: Array<any>) {
    // this.result = { ...this.result, } // METHOD Input object changes are now detected
    this.store.set('result', this.result)
    intervals.forEach((interval) => clearInterval(interval)) //On stoppe les timers
    await this.treeService.addResult(this.result)
    this.router.navigate(['tree/result'])
    // Destroying items
    this.components.forEach((component) => {
      component.destroy()
    })
  }

  onComboPulseEventEnds(event) {
    // console.log(event)
    this.comboEventTargetState = !event.toState
    // this.comboEventTargetState2 = !event.toState
  }

  // onAnimationBottomEventEnds(event) {
  //   // console.log(event)
  //   // this.comboEventTargetState = !event.toState
  //   this.comboEventTargetState2 = !event.toState
  //   console.log('fini')
  // }

}