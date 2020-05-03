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
  display: string = 'setup' // setup / countdown / plate / result (remplace le router outlet)
  countdown: number //Décompte initial du jeu

  timeCounter: number //Barre de temps qui définit la fin du jeu si elle tombe à 0
  gameTimeCounter: number //Définit le temps de jeu à l'intant t (incrémenté à chaque seconde du jeu)
  gameTime: number = 10000 //Définit la durée totale du jeu (dans le cas ou le jeu est limité dans le temps) //PAS ENCORE LE CAS

  leaderboard: { easy: databaseResult[], moderate: databaseResult[], hard: databaseResult[] } = { easy: [/*easy_results*/], moderate: [/*moderate_results*/], hard: [/*hard_results*/] }
  leaderboardLength: number = 10 //Définit le nombre maximum de personnes à afficher dans le leaderboard par catégorie de difficulté

  // Paramètres à changer dynamiquement avec la taille de l'écran:
  private plate_width: number = 550 //en px et width=height (TODO)
  private treeIcon_size: number = 100 //px

  @ViewChild('iconRef', { read: ViewContainerRef }) iconRef: ViewContainerRef;// Création dynamique du child component
  components: ComponentRef<TreeIconComponent>[] = [] //Array of our components
  treeIconFactory: ComponentFactory<TreeIconComponent>

  constructor(
    private resolver: ComponentFactoryResolver /* Create a componement factory based on our child component*/, private store: Store, private treeService: TreeService) { this.treeIconFactory = this.resolver.resolveComponentFactory(TreeIconComponent) }    // Création de la factory du TreeInconComponent

  ngOnInit() {
    this.setLeaderboard() //Récupère la data leaderboard TODO: à récup ailleurs ?
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
    this.resetGameData()
    const gameParameters: GameParameters = this.treeService.getGameParameters(event.type)
    this.result.difficulty = gameParameters.difficulty


    // TODO : changer le coef en fonction de la difficulté ? juste gagner moins ? bonjour william


    const timeCoefficient: number = gameParameters.difficulty === "easy" ? 0.1 : gameParameters.difficulty === "moderate" ? 0.2 : 0.3
    // Délai avant le début du jeu (5s)
    let countdownInterval = setInterval(() => this.countdown--, 1000)//Toutes les secondes on incrémente le countdown
    setTimeout(() => {
      clearInterval(countdownInterval) //Décompte toppé au bout de 5secondes
      this.display = "plate" //On supprime l'affichage du countdown pour ne laisser que le plateau de jeu
      let index = 0
      let gameTimeCounterInterval = setInterval(() => { this.gameTimeCounter++ }, 1000)
      let timeCounterInterval = setInterval(() => {
        this.timeCounter = this.timeCounter - timeCoefficient * Math.sqrt(Math.sqrt(this.gameTimeCounter)) //timeCounter (barre) diminue de plus en plus vite avec le temps de jeu
        // if (this.timeCounter < 0) { this.endGame([timeCounterInterval, gameTimeCounterInterval]) } //FIN DU JEU
      }, 50)
      let instantiationInterval = setInterval(() => { //Crée des composants jusqu'à ce qu'il soit stoppé par le timeout suivant
        this.instanciateOneIcon(index, gameParameters.speed);
        index++
      }, gameParameters.speed)
      setTimeout(() => { clearInterval(instantiationInterval) }, gameParameters.speed * gameParameters.iconsNumber) //Stoppe la création des composants
      //Timeout pour déterminer la fin du jeu (DANS LE CAS D'UN JEU DE TEMPS DÉTERMINÉ)
      // setTimeout(() => {this.endGame()}, this.gameTime)
    }, 5000)
  }

  private resetGameData() {
    this.result.score = 0
    this.countdown = 5
    this.timeCounter = 100
    this.gameTimeCounter = 1
  }

  private instanciateOneIcon(index: number, speed: number) { //Création des components
    this.components[index] = this.iconRef.createComponent(this.treeIconFactory)
    this.moveIcon(index)
    this.components[index].instance.touched.subscribe((iconValue: number) => { this.onIconTouched(iconValue, index, speed) })
  }

  private moveIcon(i: number) {
    this.components[i].instance.location.next(this.getRandomLocation(this.plate_width - this.treeIcon_size))
  }

  private onIconTouched(iconValue: number, i: number, delay: number) {
    this.result.score = this.result.score + iconValue
    if (this.timeCounter <= 95) {
      this.timeCounter = this.timeCounter + 5 //mettre boolean dans icontouched pour savoir si ça remonte + la barre de temps que la normale en fonction de la difficulté ?
      setTimeout(() => { this.moveIcon(i) }, delay)
      return
    }
    this.timeCounter=100 //si timeCounter >95
    setTimeout(() => { this.moveIcon(i) }, delay)
  }

  private getRandomLocation(max: number): { X: string, Y: string } {
    return { X: Math.floor(Math.random() * Math.floor(max)).toString() + 'px', Y: (Math.floor(Math.random() * Math.floor(max))).toString() + 'px' };
  }

  playAgain() {
    this.display = "setup"
  }

  private async endGame(intervals: Array<any>) {
    this.result = { ...this.result, } // METHOD Input object changes are now detected
    intervals.forEach((interval) => clearInterval(interval)) //On stoppe les timers
    await this.treeService.addResult(this.result)
    this.display = "result"
    // Destroying items
    this.components.forEach((component) => {
      component.destroy()
    })
  }
}