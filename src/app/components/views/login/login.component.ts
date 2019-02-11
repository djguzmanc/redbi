import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import * as firebase from 'firebase/app';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  constructor( private afAuth: AngularFireAuth ) { }

  ngOnInit( ) {
    this.afAuth.user.subscribe( user => {
      console.log( user )
    })
  }

  signIn( ) {
    this.webGoogleLogin( )
  }

  async webGoogleLogin( ): Promise<void> {
    try {
      const provider = new firebase.auth.GoogleAuthProvider( );
      await this.afAuth.auth.signInWithRedirect( provider );
    } catch( err ) {
      console.log( err )
    }
  
  }

}
