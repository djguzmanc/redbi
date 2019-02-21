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
import { LoginAwaitComponent } from './components/views/login-await/login-await.component';
import { UserProfileComponent } from './components/views/user-profile/user-profile.component';
import { NewRouteComponent } from './components/views/new-route/new-route.component';
import { CurrentRoutesComponent } from './components/views/current-routes/current-routes.component';
import { ChallengesComponent } from './components/views/challenges/challenges.component';
import { RouteFinderComponent } from './components/views/route-finder/route-finder.component';

const routes: Routes = [
  {
    path: 'iniciar-sesion',
    component: LoginComponent,
    canActivate: [ AuthGuard ]
  },
  {
    path: 'do-login',
    component: LoginAwaitComponent,
    canActivate: [ AuthGuard ]
  },
  {
    path: 'm',
    component: MenuWrapperComponent,
    children: [
      {
        path: 'inicio',
        component: HomeComponent
      },
      {
        path: 'perfil',
        component: UserProfileComponent
      },
      {
        path: 'crear-ruta',
        component: NewRouteComponent
      },
      {
        path: 'mis-rutas',
        component: CurrentRoutesComponent
      },
      {
        path: 'logros',
        component: ChallengesComponent
      },
      {
        path: 'buscador',
        component: RouteFinderComponent
      },
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
