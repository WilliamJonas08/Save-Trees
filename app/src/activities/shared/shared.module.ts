import { NgModule, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';

// Third-party modules
import { AngularFireDatabaseModule } from '@angular/fire/database';

import { TreeService } from './services/tree/tree.service';
import { RouterModule } from '@angular/router';
import { NavBarComponent } from './components/nav-bar/nav-bar.component';

// Translation
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  declarations: [
    NavBarComponent,
  ],
  imports: [
    CommonModule,
    AngularFireDatabaseModule,
    RouterModule,
    TranslateModule,
  ],
  exports:[
    NavBarComponent,
    TranslateModule, //IMPORTANT : provides translation for all modules which imports SharedModule
    // All their components don't have to import the translateService to use the translate directive
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
