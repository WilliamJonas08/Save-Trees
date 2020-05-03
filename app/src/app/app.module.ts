import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';


// feature modules
import { AuthModule } from 'src/auth/auth.module';
import { ActivitiesModule } from 'src/activities/activities.module';

import { Store } from 'src/store';

// containers
import { AppComponent } from './containers/app.component';
// components
import { HeaderComponent } from './components/header/header.component';
import { NavComponent } from './components/nav/nav.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

// Materials Modules
// import {MaterialModule} from '@angular/material';
import {MatProgressBarModule} from '@angular/material/progress-bar';

const ROUTES: Routes = [];

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    NavComponent,
  ],
  imports: [
    BrowserModule,
    // AppRoutingModule,
    RouterModule.forRoot(ROUTES),
    AuthModule,
    ActivitiesModule,
    BrowserAnimationsModule,
    // MaterialModule,
    MatProgressBarModule
  ],
  providers: [
    Store
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }

