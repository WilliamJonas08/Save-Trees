import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

// shared modules
import { SharedModule } from './shared/shared.module';

// Guards
import { AuthGuard } from 'src/auth/shared/guards/auth.guards';



const ROUTES: Routes = [
  { path: 'tree', canActivate:[AuthGuard], loadChildren: () => import('./tree/tree.module').then(m => m.TreeModule) },
];

@NgModule({
  declarations: [],
  imports: [
    RouterModule.forChild(ROUTES),
    SharedModule.forRoot()
  ]
})
export class ActivitiesModule { }
