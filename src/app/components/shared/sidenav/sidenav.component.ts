import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AngularFireAuth } from '@angular/fire/auth';

@Component({
  selector: 'app-sidenav',
  templateUrl: './sidenav.component.html',
  styleUrls: ['./sidenav.component.scss']
})
export class SidenavComponent implements OnInit {

  constructor( private afAuth: AngularFireAuth, private router: Router ) { }

  ngOnInit( ) {
  }

  logout( ) {
    this.afAuth.auth.signOut( ).then( () => {
      this.router.navigate( [ 'iniciar-sesion' ] )
    })
  }

}
