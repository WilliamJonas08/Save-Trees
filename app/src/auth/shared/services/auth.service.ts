import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';

import { tap } from 'rxjs/operators'

import { Store } from 'src/store';
import { AngularFireDatabase } from '@angular/fire/database';

export interface User {
  email: string,
  uid: string,
  displayName: string,
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

      this.setDisplayNameProperty(nextValue.uid)

      const user: User = {
        email: nextValue.email,
        uid: nextValue.uid,
        displayName: undefined, //pour le moment
        authenticated: true
      }
      // this.user=user
      this.store.set('user', user)
    })
  )
  //notified each time the authentication state changes


  constructor(
    private af: AngularFireAuth, //Enable to make requests to firebase
    private store: Store, //to set the user in our store
    private db: AngularFireDatabase
  ) { }

  // Utilisé par les guards
  get authState() {
    return this.af.authState
  }

  createUser(email: string, password: string, pseudo: string) {
    return this.af.createUserWithEmailAndPassword(email, password).then((user) => {
      // On complète la base de donnée avec le Pseudo choisi par l'utilisateur
      // TODO : dommage que ce soit forcément dan sune BDD annexe de celle de "auth"
      this.db.database.ref(`/userProfile/${user.user.uid}`).set({ displayName: pseudo, userId: user.user.uid });
    })
      .catch(function (error) { 
        console.log(error)
        throw error; });
  }

  loginUser(email: string, password: string) {
    return this.af.signInWithEmailAndPassword(email, password)
  }

  logoutUser() {
    return this.af.signOut()
  }

  private setDisplayNameProperty(userId: string) {
    this.db.list<string>(`/userProfile/${userId}`).valueChanges().subscribe((data) => {
      const { authenticated, displayName, email, uid } = this.store.value.user
      const newDisplayName = data[0]
      this.store.set('user', { authenticated, displayName: newDisplayName, email, uid })
      // this.displayName = data[0]
    })
  }

}
