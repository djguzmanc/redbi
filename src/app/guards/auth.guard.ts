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
        if ( data.email.split( '@' )[ 1 ] !== 'unal.edu.co' ) {
          this.router.navigate( [ 'wrong-domain' ] )
          localStorage.removeItem( 'login-attempt' )
          this.auth.auth.signOut( )
          data.delete( )
          return false
        }
        this.router.navigate( [ 'm', 'inicio' ] )
        return false
      }
    })
    return true
  }
}
