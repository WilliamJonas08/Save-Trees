import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Store } from 'src/store';
import { Router } from '@angular/router';

@Component({
  selector: 'setup',
  templateUrl: './setup.component.html',
  styleUrls: ['./setup.component.scss']
})
export class SetupComponent implements OnInit {

  currentDifficulty:string

  // form = this.fb.group({
  //   type: 'easy'
  // })

  constructor(
    // private fb: FormBuilder,
    private store: Store,
    private router:Router,
  ) { }

  ngOnInit(): void {
    this.store.select('difficulty').subscribe((difficulty:string)=>{
      this.currentDifficulty=difficulty
    })
  }

  // async onSubmit(){
    // TODO : voir si le await était nécessaire
    // await this.store.set('difficulty',this.form.value)
    // this.router.navigate(['tree/game'])
  // }

  play(){
    this.router.navigate(['tree/game'])
  }


}
