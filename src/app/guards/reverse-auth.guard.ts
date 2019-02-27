import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { CanActivate } from '@angular/router';
import { Observable } from 'rxjs';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore } from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root'
})
export class ReverseAuthGuard implements CanActivate {
  
  constructor( private auth: AngularFireAuth, private router: Router, private db: AngularFirestore ) {}

  canActivate( ): Observable<boolean> | boolean {
    this.auth.authState.subscribe( data => {
      if ( !data ) {
        this.router.navigate( [ 'iniciar-sesion' ] )
        return false
      }
    })
    return true
  }

}
