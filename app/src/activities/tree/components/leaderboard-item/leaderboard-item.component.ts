import { Component, OnInit, Input, OnDestroy } from '@angular/core';

import { databaseResult } from 'src/activities/shared/services/tree/tree.service';
import { Subject } from 'rxjs';

@Component({
  selector: 'leaderboard-item',
  templateUrl: './leaderboard-item.component.html',
  styleUrls: ['./leaderboard-item.component.scss']
})
export class LeaderboardItemComponent implements OnInit {

  name: string
  score: number
  isPlayer: boolean = false

  @Input()
  data: databaseResult

  @Input()
  displayName:string

  constructor() { }

  ngOnInit(): void {
    this.isPlayer = (this.displayName === this.data.displayName)
    this.name = this.data.displayName
    this.score = this.data.score
  }


}
