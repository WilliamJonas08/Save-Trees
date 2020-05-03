import { Component, ViewChild, ViewContainerRef, ComponentFactoryResolver, ComponentRef, ComponentFactory, OnInit } from '@angular/core';

import { TreeService, GameParameters, Result, databaseResult } from 'src/activities/shared/services/tree/tree.service';

// On importe le child component pour pouvoir le créer dynamiquement avec une Factory
import { TreeIconComponent } from '../../components/tree-icon/tree-icon.component';
import { Store } from 'src/store';
import { User } from 'src/auth/shared/services/auth.service';
import { switchMap } from 'rxjs/operators';

@Component({
  selector: 'app-tree',
  templateUrl: './tree.component.html',
  styleUrls: ['./tree.component.scss']
})
export class TreeComponent implements OnInit {

  result: Result = { game: 'tree', difficulty: 'easy', score: 0 }
  display: string = 'setup'// setup / countdown / plate / result (remplace le router outlet)
  countdown: number = 5
  gameTime: number = 15000

  leaderboard: { easy: databaseResult[], moderate: databaseResult[], hard: databaseResult[] }
    = { easy: [/*easy_results*/], moderate: [/*moderate_results*/], hard: [/*hard_results*/] }
  leaderboardLength: number = 10

  // Paramètres à changer dynamiquement avec la taille de l'écran:
  private plate_width: number = 550 //en px et width=height (TODO)
  private treeIcon_size: number = 100 //px

  @ViewChild('iconRef', { read: ViewContainerRef }) iconRef: ViewContainerRef;// Création dynamique du child component

  components: ComponentRef<TreeIconComponent>[] = [] //Array of our components
  treeIconFactory: ComponentFactory<TreeIconComponent>

  constructor(
    private resolver: ComponentFactoryResolver, // Create a componement factory based on our child component
    private store: Store,
    private treeService: TreeService
  ) {
    // Création de la factory du TreeInconComponent
    this.treeIconFactory = this.resolver.resolveComponentFactory(TreeIconComponent) // Function that resolves the component
  }

  ngOnInit() {
    this.setLeaderboard()
  }

  setLeaderboard() {
    this.treeService.results$.subscribe((leaderboard) => {
      this.leaderboard = { easy: [/*easy_results*/], moderate: [/*moderate_results*/], hard: [/*hard_results*/] }
      const leaderBoardStructure = ['easy', 'moderate', 'hard'] //ou Object.key(this.leaderboard)
      //Pour chaque user, on ajoute ses résultats à chaque catégorie
      leaderboard.forEach((userResults) => {
        for (let difficulty of leaderBoardStructure) { //pour chaque difficulté expérimentée par le user
          let result = this.treeService.getResult(userResults, difficulty).result//on ne garde que la partie intéressante des résultats de la db
          if (result) {
            this.leaderboard[difficulty].push(result)
          }
        }
      })
      // On filtre le leaderBoard et on le trie //works
      for (let difficulty of leaderBoardStructure) {
        this.leaderboard[difficulty] = this.leaderboard[difficulty].sort((a, b) => b.score - a.score).slice(0, this.leaderboardLength)
      }
      // console.log('Leaderboard', this.leaderboard)
    })
  }

  beginGame(event: { type: string }) {
    // TODO : enable custom params
    // Définition des paramètres du jeu
    this.display = "countdown"
    this.result.score = 0
    this.countdown = 5
    const gameParameters: GameParameters = this.treeService.getGameParameters(event.type)
    this.result.difficulty = gameParameters.difficulty
    // Délai avant le début du jeu (5s)
    let countdownInterval = setInterval(() => this.countdown--, 1000)//Toutes les secondes on incrémente le countdown
    setTimeout(() => {
      clearInterval(countdownInterval) //Décompte toppé au bout de 5secondes
      this.display = "plate" //On supprime l'affichage du countdown pour ne laisser que le plateau de jeu
      let index = 0
      let instantiationInterval = setInterval(() => { //Crée des composants jusqu'à ce qu'il soit stoppé par le timeout suivant
        this.instanciateOneIcon(index, gameParameters.speed);
        index++
      }, gameParameters.speed)
      setTimeout(() => { clearInterval(instantiationInterval) }, gameParameters.speed * gameParameters.iconsNumber) //Stoppe la création des composants
      //Timeout pour déterminer la fin du jeu
      setTimeout(() => {
        this.endGame()
      }, this.gameTime)
    }, 5000) //TODO : remettre 5
  }

  instanciateOneIcon(index: number, speed: number) { //Création des components
    this.components[index] = this.iconRef.createComponent(this.treeIconFactory)
    this.moveIcon(index)
    this.components[index].instance.touched.subscribe(() => { this.onIconTouched(index, speed) })
  }

  moveIcon(i: number) {
    this.components[i].instance.location.next(this.getRandomLocation(this.plate_width - this.treeIcon_size))
  }

  onIconTouched(i: number, delay: number) {
    this.result.score++
    console.log("Clicked")
    setTimeout(() => { this.moveIcon(i) }, delay)
  }

  getRandomLocation(max: number): { X: string, Y: string } {
    return { X: Math.floor(Math.random() * Math.floor(max)).toString() + 'px', Y: (Math.floor(Math.random() * Math.floor(max))).toString() + 'px' };
  }

  playAgain() {
    this.display = "setup"
  }

  async endGame() {
    this.result = { ...this.result, } // METHOD Input object changes are now detected
    await this.treeService.addResult(this.result)
    this.display = "result"
    // Destroying items
    this.components.forEach((component) => {
      component.destroy()
    })
  }
}