import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';

import { tap } from 'rxjs/operators'

import { Store } from 'src/store';

export interface User {
  email: string,
  uid: string,
  authenticated: boolean,
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  auth$ = this.af.authState.pipe(
    tap(nextValue => {
      if (!nextValue) { //quand le user n'est pas encore connecté
        this.store.set('user', null)
        return
      }
      // quand user connecté
      const user: User = {
        email: nextValue.email,
        uid: nextValue.uid,
        authenticated: true
      }
      this.store.set('user', user)
    })
  )
  //notified each time the authentication state changes

  constructor(
    private af: AngularFireAuth, //Enable to make requests to firebase
    private store: Store, //to set the user in our store
  ) { }

  // Utilisé par les guards
  get authState() {
    return this.af.authState
  }

  createUser(email: string, password: string) {
    return this.af.createUserWithEmailAndPassword(email, password)
  }

  loginUser(email: string, password: string) {
    return this.af.signInWithEmailAndPassword(email, password)
  }

  logoutUser() {
    return this.af.signOut()
  }

}
