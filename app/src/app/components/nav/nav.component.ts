import { Component, OnInit, ChangeDetectionStrategy, Input, Output, EventEmitter } from '@angular/core';
import { User } from 'src/auth/shared/services/auth.service';

@Component({
  selector: 'app-nav',
  // changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.scss']
})
export class NavComponent implements OnInit {

  @Input()
  pseudo

  @Input()
  user: User

  @Output()
  logout = new EventEmitter<any>()


  constructor() { }

  ngOnInit(): void {
  }

  logoutUser() {
    this.logout.emit()
  }
}
