import { Component, OnInit, Input, Output, EventEmitter, ChangeDetectionStrategy, OnChanges } from '@angular/core';

import { Result, databaseResult } from 'src/activities/shared/services/tree/tree.service';
import { Store } from 'src/store';
import { Subject } from 'rxjs';


@Component({
  selector: 'result',
  // changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './result.component.html',
  styleUrls: ['./result.component.scss']
})
export class ResultComponent implements OnChanges, OnInit {

  _displayDifficulty: string  //defines which leaderboard difficulty the user want to display
  displayName: string

  @Input()
  result: Result

  @Input()
  leaderboard: { easy: databaseResult[], moderate: databaseResult[], hard: databaseResult[] }

  @Output()
  replay = new EventEmitter<any>()

  constructor(private store: Store) { }

  ngOnInit() {
    // console.log(this.displayName)
  }
  
  ngOnChanges(): void {
    this.displayName =this.store.value.user.displayName // TODO on l'actualise un peut trop souvent mais on l'a
    this._displayDifficulty = this.result.difficulty
  }


  playAgain() {
    this.replay.emit() //Mettre un score à battre ?
  }

}
