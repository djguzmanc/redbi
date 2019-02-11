import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { AngularFireAuth } from '@angular/fire/auth';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor( private auth: AngularFireAuth, private router: Router ) {}

  canActivate( ): Observable<boolean> | boolean {
    this.auth.authState.subscribe( data => {
      if ( !data ) {
        return true
      } else {
        this.router.navigate( [ 'm', 'inicio' ] )
        return false
      }
    })
    return true
  }
}
