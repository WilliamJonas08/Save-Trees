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

export interface Result { //Local result
  game: string,
  difficulty: string,
  score: number
}

export interface databaseResult { // Database result
  difficulty: string,
  score: number,
  displayName: string,
}

@Injectable({
  providedIn: 'root'
})
export class TreeService {


  // private userID: string //this.authService.user.uid
  // private displayName: string

  results$ = this.db.list<databaseResult[]>(`tree`).valueChanges()
    // .pipe(
    //   tap((next) => {
    //     this.setUserResult(this.store.value.user.uid) //useless car il s'agit d'un subscribe (elle se maj tt seule je pense)
    //   })
      // switchMap((tree_database,index) => {
      //   console.log('tree_database',tree_database)
      //   // this.db.list(`tree`, ref => ref.orderByChild('score')).valueChanges()
      //   // return this.db.list(`tree`, ref => ref.orderByKey()).valueChanges()
      // })
    // )

  /**
   * Attention il s'agit d'un object dont les clés sont générées aléatoirement par FireBase
   * Nécessité d'utiliser getResults
   */
  userBestScores: databaseResult[] // TODO Possibilité de le mettre dans le store pour le mettre sous forme d'observables (tap ?)


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
    // TODO voir pour regrouper tous les subscribes
    this.store.select<User>('user').subscribe((user) => { //on utilise le subscribe pour être sur d'avoir les données user lors de l'appel de setUserResult
      this.setUserResult(user?.uid) //AUTRE SUBSCRIPTION
      // this.userID = user.uid
    })
    // TODO : si on ne veut pas appeller le subscribe 3 fois, on peut set le store avec la variable userResult (depuis le tree component , on init) que l'on récupérerait directement ici via le store
  }


  getGameParameters(difficulty: string) {
    return this.gameParameters.find((parameter) => parameter.difficulty === difficulty)
  }

  async addResult(result: Result) {
    const existingResult = this.getResult(this.userBestScores, result.difficulty)
    if (existingResult.result) {
      // le user a déja un résultat existant
      if (existingResult.result.score >= result.score) {
        // Record non battu
        return
      }
      // Record battu
      return this.db.list(`${result.game}/${this.store.value.user.uid}`).update(existingResult.key, { difficulty: result.difficulty, score: result.score, displayName: this.store.value.user.displayName })
        .then(() => { })
    }
    //New result
    return this.db.list(`${result.game}/${this.store.value.user.uid}`)
      .push({ difficulty: result.difficulty, score: result.score, displayName: this.store.value.user.displayName })
      .then(() => { })
  }

  /**
   * Enable to get the user result with a specific difficulty with the classic object format from a dataBaseResult.
   * @param resultData resultData refers to this.userResults
   * @param difficulty 
   * The returned key is used to update the database 
   * Only used externally in the leaderloard -> TODO à mettre ici
   */
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

  /**
   * Returns the use rbest store based on the difficulty
   * @param difficulty 
   */
  getUserRecord(difficulty: string) {
    return this.getResult(this.userBestScores, difficulty).result.score
  }

  // /**
  //  * Returns the actualised leaderboard array
  //  * @param leaderboardLenght 
  //  * (les composants n'ont pas besoin de subscribe aux résultats à priori)
  //  */
  // async getLeaderboard(leaderboardLenght: number) {
  //   let LEADERBOARD: { easy: databaseResult[], moderate: databaseResult[], hard: databaseResult[] }
  //   await this.results$.subscribe((leaderboard) => {
  //     LEADERBOARD = { easy: [/*easy_results*/], moderate: [/*moderate_results*/], hard: [/*hard_results*/] }
  //     const leaderBoardStructure = ['easy', 'moderate', 'hard'] //ou Object.key(this.leaderboard)
  //     //Pour chaque user, on ajoute ses résultats à chaque catégorie
  //     leaderboard.forEach((userResults) => {
  //       for (let difficulty of leaderBoardStructure) { //pour chaque difficulté expérimentée par le user
  //         let result = this.getResult(userResults, difficulty).result//on ne garde que la partie intéressante des résultats de la db
  //         if (result) {
  //           LEADERBOARD[difficulty].push(result)
  //         }
  //       }
  //     })
  //     // On filtre le leaderBoard et on le trie //works
  //     for (let difficulty of leaderBoardStructure) {
  //       LEADERBOARD[difficulty] = LEADERBOARD[difficulty].sort((a, b) => b.score - a.score).slice(0, leaderboardLenght)
  //     }
  //   })
  //   return LEADERBOARD
  // }

  // only used inside the constructor
  private setUserResult(userId: string) { //Pour être disponible dans "resultAlreadyExists"
    this.db.object<databaseResult[]>(`tree/${userId}`).valueChanges().subscribe((userResults: databaseResult[]) => {
      this.userBestScores = userResults
      // console.log(userResults)
    })
  }

}
