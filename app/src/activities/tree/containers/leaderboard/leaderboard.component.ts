import { Component, OnInit } from '@angular/core';
import { Store } from 'src/store';
import { databaseResult, TreeService } from 'src/activities/shared/services/tree/tree.service';

@Component({
  selector: 'app-leaderboard',
  templateUrl: './leaderboard.component.html',
  styleUrls: ['./leaderboard.component.scss']
})
export class LeaderboardComponent implements OnInit {

  _displayDifficulty: string = "hard" //defines which leaderboard difficulty the user want to display
  // TODO : le fait d'afficher la difficulté hard en premier semble laisser le temps aux autres affichages de difficultés de créer correctement le leaderboard item du bas dans les autres difficultés...
  // J'ai l'impression que le pb vient de l'absence de détection (de la part du HTML) de la modif d'un objet
  displayName: string

  userResultOutsideLeaderboard: { easy: databaseResult[], moderate: databaseResult[], hard: databaseResult[] } = { easy: [/*easy_results*/], moderate: [/*moderate_results*/], hard: [/*hard_results*/] }
  leaderboard: { easy: databaseResult[], moderate: databaseResult[], hard: databaseResult[] } = { easy: [/*easy_results*/], moderate: [/*moderate_results*/], hard: [/*hard_results*/] }
  leaderboardLength: number = 10 //Définit le nombre maximum de personnes à afficher dans le leaderboard par catégorie de difficulté

  constructor(private store: Store, private treeService: TreeService) { }

  ngOnInit() {
    // TODO : get last result from the store to get the last difficulty (& maj store au début de jeu)
    this.displayName = this.store.value.user.displayName
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

        const userResultExist = this.leaderboard[difficulty].find(element => element.displayName === this.displayName)
        this.userResultOutsideLeaderboard[difficulty] = userResultExist ? userResultExist : { score: 0, displayName: this.displayName, difficulty }
        // this.userResultOutsideLeaderboard[difficulty] = { ...this.userResultOutsideLeaderboard[difficulty] }


        this.leaderboard[difficulty] = this.leaderboard[difficulty].sort((a, b) => b.score - a.score).slice(0, this.leaderboardLength)

        const foundInFilteredLeaderboard = this.leaderboard[difficulty].find(element => element.displayName === this.displayName)
        if (foundInFilteredLeaderboard) {
          this.userResultOutsideLeaderboard[difficulty] = null
          // this.userResultOutsideLeaderboard[difficulty] = { ...this.userResultOutsideLeaderboard[difficulty] }
        }
      }
      console.log("USER", this.userResultOutsideLeaderboard)
    })
  }

}
