import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { SharedModule } from '../shared/shared.module';

import { FeedbackComponent } from './containers/feedback/feedback.component';

const ROUTES: Routes = [
  { path: '', component: FeedbackComponent },
];

@NgModule({
  declarations: [FeedbackComponent],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule.forChild(ROUTES)
  ],
  providers:[
    SharedModule
  ]
})
export class FeedbackModule { }
