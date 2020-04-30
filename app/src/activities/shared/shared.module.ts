import { NgModule, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';

// Third-party modules
import { AngularFireDatabaseModule } from '@angular/fire/database';

import { TreeService } from './services/tree/tree.service';
import { RouterModule } from '@angular/router';


@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    AngularFireDatabaseModule,
    RouterModule
  ]
})
export class SharedModule { 
  static forRoot(): ModuleWithProviders{
    return{
      ngModule:SharedModule,
      providers:[
        TreeService
      ]
    }
  }
}
