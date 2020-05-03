import { Injectable } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/database';
import { Observable, of } from 'rxjs';
import { tap, switchMap } from 'rxjs/operators';

import { User } from 'src/auth/shared/services/auth.service';

import { Store } from 'src/store';

export interface GameParameters {
  difficulty: string,
  iconsNumber: number,
  speed: number,
}

export interface Result {
  game: string,
  difficulty: string,
  score: number
}

export interface databaseResult {
  difficulty: string,
  score: number,
  displayName: string,
}

@Injectable({
  providedIn: 'root'
})
export class TreeService {


  private userID: string //this.authService.user.uid
  private displayName: string

  results$ = this.db.list<databaseResult[]>(`tree`).valueChanges()
  // .pipe(
  //   switchMap((tree_database,index) => {
  //     console.log('tree_database',tree_database)
  //     // this.db.list(`tree`, ref => ref.orderByChild('score')).valueChanges()
  //     return this.db.list(`tree`, ref => ref.orderByKey()).valueChanges()
  //   })
  // )

  //tap pour injecter les résutat du current user dans le store ?
  userResults: databaseResult[] // TODO Possibilité de le mettre dans le store


  private gameParameters: GameParameters[] = [
    {
      difficulty: 'easy',
      iconsNumber: 1,
      speed: 500,
    },
    {
      difficulty: 'moderate',
      iconsNumber: 2,
      speed: 400,
    },
    {
      difficulty: 'hard',
      iconsNumber: 3,
      speed: 300,
    }
  ]

  constructor(private db: AngularFireDatabase, private store: Store) {
    this.store.select<User>('user').subscribe((user) => {
      this.userID = user.uid
      this.setUserResult(user.uid)
      // TODO : si on ne veut pas appeller le subscribe 3 fois, on peut set le store avec la variable userResult (depuis le tree component , on init) que l'on récupérerait directement ici via le store
    })
  }


  getGameParameters(difficulty: string) {
    return this.gameParameters.find((parameter) => parameter.difficulty === difficulty)
  }

  async addResult(result: Result) {
    const existingResult = this.getResult(this.userResults, result.difficulty)
    if (existingResult.result) {
      // le user a déja un résultat existant
      if (existingResult.result.score >= result.score) {
        // Record non battu
        // console.log("RECORD NON BATTU")
        return
      }
      // Record battu
      return this.db.list(`${result.game}/${this.store.value.user.uid}`).update(existingResult.key, { difficulty: result.difficulty, score: result.score, displayName: this.store.value.user.displayName })
        .then(() => {
          // console.log("UPDATE")
        })
    }
    return this.db.list(`${result.game}/${this.store.value.user.uid}`)
      .push({ difficulty: result.difficulty, score: result.score, displayName: this.store.value.user.displayName })     //avant :${this.userID}
      .then(() => {
        // console.log("NEW RESULT")
      })
    // TODO ?:(securité) displayName censé être disponible à ce moment la -> comment en être certain a tout instant ?
    // TODO : même si le store est updaté comme un observable, le subscribe du TreeService ne semble pas update la correcte valeur du userId... 
    // (je triche donc en utilisant la valeur immédiate du store plutot que les propriétés locales de cette classe) // console.log("LOCAL",this.userID) // console.log("STORE",this.store.value.user.uid)
  }

  /** Enable to get the user result with a specific difficulty with the classic object format. 
   *  
   *  resultData refers to this.userResults */
  getResult(resultData: databaseResult[], difficulty: string): { result: databaseResult | undefined, key: string | undefined } {
    // Recherche de l'existence d'un précédent résultat dans la difficulté concernée
    if (!resultData) { // Si aucun résultat n'a été enregistré pour le moment
      return { result: undefined, key: undefined }
    }
    // si la difficulté a déja été expérimentée par le user
    for (let key of Object.keys(resultData)) { //liste de 3 key-properties (générées aléatoirement par Firebase)
      if (resultData[key].difficulty === difficulty) { //une seule possibilité parmis les 3 clés (car un resultat enregistré pour chaque difficulté)
        return { result: resultData[key], key: key }
      }
    }
    // si la difficulté n'a pas encore été expérimentée par le user (pas enregistrée)
    return { result: undefined, key: undefined }
  }

  // only used inside the constructor
  private setUserResult(userId: string) { //Pour être disponible dans "resultAlreadyExists"
    this.db.object<databaseResult[]>(`tree/${userId}`).valueChanges().subscribe((userResults: databaseResult[]) => {
      // console.log("SET USER RESULT")
      this.userResults = userResults
    })
  }

}
