import { Component, OnInit, OnDestroy } from '@angular/core';
import { Observable, Subscription } from 'rxjs';

import { Store } from 'src/store';

import { AuthService, User } from 'src/auth/shared/services/auth.service';
import { Router } from '@angular/router';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, OnDestroy {

  user$: Observable<User>
  subscription: Subscription

  constructor(
    private store: Store,
    private authService: AuthService,
    private router: Router
  ) { }

  ngOnInit() {
    this.subscription = this.authService.auth$.subscribe() // Initiate the data flow for the subscription
    this.user$ = this.store.select<User>('user')
  }

  async onLogout() {
    await this.authService.logoutUser() 
    this.router.navigate(['/auth/login'])
  }

  ngOnDestroy() { //Ce component ne sera jamais détruit mais c'est une bonne pratique à avoir 
    this.subscription.unsubscribe()
  }

}
