import { Injectable } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/database';

@Injectable({
  providedIn: 'root'
})
export class FeedbackService {

  constructor(private db: AngularFireDatabase) { }

  addFeedback(value){
    console.log(value)
    this.db.list(`feedback`)
      .push(value) 
      .then(() => {
        return alert("Merci de votre retour !")
      })
  }

}
