import { Component, OnInit, ChangeDetectionStrategy, AfterViewInit } from '@angular/core';
import { Subject } from 'rxjs';
import { Router } from '@angular/router';

import { Result, databaseResult, TreeService } from 'src/activities/shared/services/tree/tree.service';

import { Store } from 'src/store';


@Component({
  selector: 'result',
  // changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './result.component.html',
  styleUrls: ['./result.component.scss']
})
export class ResultComponent implements OnInit, AfterViewInit {

  _displayDifficulty: string  //defines which difficulty have been played
  currentDifficulty: string //defines the difficulty the have been played and the future game configuration

  // displayName: string
  displayedScore: number = 0 //Conteur incrémenté en fin de partie
  bestScore: boolean = false//defines if the user beat his own record

  result: Result = { game: 'tree', score: 999, difficulty: "hard" }

  constructor(private store: Store, private router: Router, private treeService: TreeService) { }

  ngOnInit() {
    this.store.select('difficulty').subscribe((difficulty: string) => {
      this.currentDifficulty = difficulty
    })
    this.result = this.store.value.result //TODO voir si select nécessaire (ex si store pas encore updaté)
    // this.displayName =this.store.value.user.displayName // TODO on l'actualise un peut trop souvent mais on l'a
    this._displayDifficulty = this.result.difficulty
    const userRecord = this.treeService.getUserRecord(this.result?.difficulty) //le résult sera disponible en temps normal d ecycle de jeu
    //IMPORTANT : si le user vient de faire un score supérieur ou égal a son ancien record, on aura userRecord===this.result.score
    if (userRecord === this.result.score) {
      this.bestScore = true
    }

  }

  ngAfterViewInit() {
    if (this.result.score > 0) {
      const incrementationInterval = setInterval(() => {
        this.displayedScore = Math.floor(this.displayedScore + 1)
      }, 3000 / this.result?.score)//le résult sera disponible en temps normal de cycle de jeu
      setTimeout(() => {
        this.displayedScore = this.result.score
        clearInterval(incrementationInterval)
      }, 3000)
    }
  }


  playAgain() {
    if (this.displayedScore === this.result.score) { //si le score a été affcihé (après 3 s)
      this.router.navigate(['tree/game'])
      // this.router.navigate(['tree/setup']) //Mettre un score à battre ?
    }
    return
  }

}
