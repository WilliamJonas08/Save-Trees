import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';

import { SharedModule } from '../shared/shared.module';

// containers
import { TreeComponent } from './containers/tree/tree.component';
import { SetupComponent } from './containers/setup/setup.component';
import { ResultComponent } from './containers/result/result.component';
import { LeaderboardComponent } from './containers/leaderboard/leaderboard.component';

// components
import { CounterComponent } from './components/counter/counter.component';
import { TreeIconComponent } from './components/tree-icon/tree-icon.component';
import { SetupTypeComponent } from './components/setup-type/setup-type.component';
import { LeaderboardItemComponent } from './components/leaderboard-item/leaderboard-item.component';
import { FlameComponent } from './components/flame/flame.component';

import {MatProgressBarModule} from '@angular/material/progress-bar';


const ROUTES: Routes = [
  { path: '', children:[
    { path: 'setup', component: SetupComponent },
    { path: 'game', component: TreeComponent },
    { path: 'result', component: ResultComponent },
    { path: 'leaderboard', component: LeaderboardComponent },
    { path: '**', redirectTo: 'setup'},
  ] },
];

@NgModule({
  declarations: [
    TreeComponent,
    CounterComponent,
    TreeIconComponent,
    SetupComponent,
    SetupTypeComponent,
    ResultComponent,
    LeaderboardItemComponent,
    FlameComponent,
    LeaderboardComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(ROUTES),
    ReactiveFormsModule,
    MatProgressBarModule,
    SharedModule
  ],
  providers: [
    SharedModule,
  ]
})
export class TreeModule { }
