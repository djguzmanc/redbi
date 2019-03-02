import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { Router } from '@angular/router';
import * as firebase from 'firebase/app';
import { DataService } from 'src/app/services/data-service/data.service';
import { AlertService } from 'src/app/services/alert-service/alert.service';

@Component({
  selector: 'app-login-await',
  templateUrl: './login-await.component.html',
  styleUrls: ['./login-await.component.scss']
})
export class LoginAwaitComponent implements OnInit {

  constructor( private afAuth: AngularFireAuth, private router: Router, private dataService: DataService, private alertService: AlertService ) { }

  ngOnInit( ) {
    if( !localStorage.getItem( 'login-attempt' ) )
      this.webGoogleLogin( )
    else {
      setTimeout( () => {
        this.alertService.showErrorMessageSwal( 'Algo salió mal', 'Se ha esperado demasiado tiempo para iniciar sesión. Revisa tu conexión.' ).then( () => {
          this.dataService.logout( )
        })
      }, 15000 )
    }
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
