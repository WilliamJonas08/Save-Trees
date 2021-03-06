import { BehaviorSubject, Observable } from 'rxjs';
import { distinctUntilChanged, pluck } from 'rxjs/operators';

import { User } from './auth/shared/services/auth.service';
import { Result } from './activities/shared/services/tree/tree.service';

export interface State{
    user:User
    difficulty: string
    result: Result
    // TODO inject user best scores
}

const state : State = {
    user : undefined,
    difficulty : 'easy',
    result: undefined //last played result
}

export class Store {

    private subject = new BehaviorSubject<State>(state)
    private store = this.subject.asObservable().pipe(distinctUntilChanged())
    
    get value(){
        return this.subject.value
    }

    select<T>(name:string):Observable<T>{
        return this.store.pipe(pluck(name))
        // pluck : returns an observable based on the object property
    }

    set(name:string, state:any){
        this.subject.next({
            ...this.value, [name]:state //will add the property name if id doesn't exists already
        })
    }
}