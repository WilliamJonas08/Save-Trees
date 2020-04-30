import { Component, Input, Output, EventEmitter, ChangeDetectionStrategy } from '@angular/core';
import { User } from 'src/auth/shared/services/auth.service';

@Component({
  selector: 'app-header',
  changeDetection: ChangeDetectionStrategy.OnPush, //because we use observables
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent{

  @Input()
  user:User

  @Output()
  logout = new EventEmitter<any>()

  logoutUser(){
    this.logout.emit()
  }

}
