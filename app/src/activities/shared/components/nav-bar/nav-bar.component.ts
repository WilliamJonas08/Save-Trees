import { Component, OnInit } from '@angular/core';
import { Store } from 'src/store';

@Component({
  selector: 'nav-bar',
  templateUrl: './nav-bar.component.html',
  styleUrls: ['./nav-bar.component.scss']
})
export class NavBarComponent implements OnInit {

  currentDifficulty: string

  constructor(private store: Store) { }

  ngOnInit() {
    this.currentDifficulty = this.store.value.difficulty
  }

  toggleDifficulty() {
    if (this.currentDifficulty === "easy") {
      this.store.set('difficulty', 'moderate')
      this.currentDifficulty = "moderate"
      return
    }
    if (this.currentDifficulty === "moderate") {
      this.store.set('difficulty', 'hard')
      this.currentDifficulty = 'hard'
      return

    }
    if (this.currentDifficulty === "hard") {
      this.store.set('difficulty', 'easy')
      this.currentDifficulty = "easy"
      return

    }
  }

}
