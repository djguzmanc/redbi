import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

/**
 * Guard imports
 */
import { AuthGuard } from './guards/auth.guard';

/**
 * Component imports
 */
import { LoginComponent } from './components/views/login/login.component';
import { MenuWrapperComponent } from './components/utilities/menu-wrapper/menu-wrapper.component';
import { HomeComponent } from './components/views/home/home.component';

const routes: Routes = [
  {
    path: 'iniciar-sesion',
    component: LoginComponent,
    canActivate: [ AuthGuard ]
  },
  {
    path: 'm',
    component: MenuWrapperComponent,
    children: [
      {
        path: 'inicio',
        component: HomeComponent
      }
    ]
  },
  {
    path: '**',
    pathMatch:'full',
    redirectTo: 'iniciar-sesion'
  } 
];

@NgModule({
  imports: [ RouterModule.forRoot( routes ) ],
  exports: [ RouterModule ]
})
export class AppRoutingModule { }
