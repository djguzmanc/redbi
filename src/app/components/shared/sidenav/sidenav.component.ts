import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AngularFireAuth } from '@angular/fire/auth';

@Component({
  selector: 'app-sidenav',
  templateUrl: './sidenav.component.html',
  styleUrls: ['./sidenav.component.scss']
})
export class SidenavComponent implements OnInit {

  userData

  constructor( private afAuth: AngularFireAuth, private router: Router ) {
    afAuth.user.subscribe( data => {
      this.userData = data
      console.log( this.userData )
    })
  }

  ngOnInit( ) {
  }

  logout( ) {
    this.afAuth.auth.signOut( ).then( () => {
      localStorage.removeItem( 'login-attempt' )
      this.router.navigate( [ 'iniciar-sesion' ] )
    })
  }

}
