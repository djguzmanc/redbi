import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { Router } from '@angular/router';
import * as firebase from 'firebase/app';

@Component({
  selector: 'app-login-await',
  templateUrl: './login-await.component.html',
  styleUrls: ['./login-await.component.scss']
})
export class LoginAwaitComponent implements OnInit {

  constructor( private afAuth: AngularFireAuth, private router: Router ) { }

  ngOnInit( ) {
    if( !localStorage.getItem( 'login-attempt' ) )
      this.webGoogleLogin( )
  }

  async webGoogleLogin( ): Promise<void> {
    try {
      const provider = new firebase.auth.GoogleAuthProvider( );
      localStorage.setItem( 'login-attempt', 'true' )
      await this.afAuth.auth.signInWithRedirect( provider );
    } catch( err ) {
      console.log( err )
    }
  }

}
