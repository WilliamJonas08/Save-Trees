import { Component, OnInit, Input, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'counter',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './counter.component.html',
  styleUrls: ['./counter.component.scss']
})
export class CounterComponent implements OnInit {

  @Input()
  score:number

  @Input()
  timeCounter:number

  constructor() { }

  ngOnInit(): void {
  }

}
