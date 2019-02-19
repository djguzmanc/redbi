import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { CanActivate } from '@angular/router';
import { Observable } from 'rxjs';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore } from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor( private auth: AngularFireAuth, private router: Router, private db: AngularFirestore ) {}

  canActivate( ): Observable<boolean> | boolean {
    this.auth.authState.subscribe( data => {
      if ( !data ) {
        return true
      } else {
        if ( data.email.split( '@' )[ 1 ] !== 'unal.edu.co' ) {
          localStorage.removeItem( 'login-attempt' )
          this.auth.auth.signOut( )
          data.delete( )
          this.router.navigate( [ 'iniciar-sesion' ], { queryParams: { wrongDomain: true } } )
          return false
        } else {
          this.db.doc( `users/${ data.uid }` ).valueChanges( ).toPromise( ).then(
            res => {
              if ( !res )
                this.db.collection( 'users' ).doc( data.uid ).set({
                  email: data.email,
                  fullName: data.displayName,
                  photoURL: data.photoURL,
                  trips: 0,
                  challenges: 0,
                  friends: 0,
                  faculty: null,
                  gender: null,
                  preferences: {
                    edited: false,
                    experience: 0,
                    location: null,
                    medkit: false,
                    punch_out: false,
                    road_preference: 0,
                    speed: 0
                  }
                })
            }
          )
          this.router.navigate( [ 'm', 'inicio' ] )
          return false
        }
      }
    })
    return true
  }
}
