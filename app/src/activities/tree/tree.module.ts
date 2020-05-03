import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';

import { SharedModule } from '../shared/shared.module';

// containers
import { TreeComponent } from './containers/tree/tree.component';

// components
import { CounterComponent } from './components/counter/counter.component';
import { NavBarComponent } from './components/nav-bar/nav-bar.component';
import { TreeIconComponent } from './components/tree-icon/tree-icon.component';
import { SetupComponent } from './components/setup/setup.component';
import { SetupTypeComponent } from './components/setup-type/setup-type.component';
import { ResultComponent } from './components/result/result.component';
import { LeaderboardItemComponent } from './components/leaderboard-item/leaderboard-item.component';


const ROUTES: Routes = [
  { path: '', component: TreeComponent },
];

@NgModule({
  declarations: [
    TreeComponent,
    CounterComponent,
    NavBarComponent,
    TreeIconComponent,
    SetupComponent,
    SetupTypeComponent,
    ResultComponent,
    LeaderboardItemComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(ROUTES),
    ReactiveFormsModule
  ],
  providers: [
    SharedModule,
  ]
})
export class TreeModule { }
