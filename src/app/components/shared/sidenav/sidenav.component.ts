import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { Router } from '@angular/router';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore } from '@angular/fire/firestore';

import swal from 'sweetalert';
import { AlertService } from 'src/app/services/alert-service/alert.service';
import { User, DEFAULT_USER } from 'src/app/interfaces/user';

@Component({
  selector: 'app-sidenav',
  templateUrl: './sidenav.component.html',
  styleUrls: ['./sidenav.component.scss']
})
export class SidenavComponent implements OnInit {

  userData: User = DEFAULT_USER
  @Output( ) closing = new EventEmitter( )

  allStats = []

  constructor( private afAuth: AngularFireAuth, private db: AngularFirestore, private router: Router, private alertService: AlertService ) {
    afAuth.user.subscribe( data => {
      if ( data ) {
        db.doc( `users/${ data.uid }` ).valueChanges( ).subscribe(
          ( res: User ) => {
            if ( res ) {
              this.userData = res
              if ( this.userData.faculty == null || this.userData.gender == null ) {
                this.alertService.showConfirmSwal( 'Parece que no has completado tus datos de perfil', '¿Deseas completarlos? Tomará 5 minutos :p' ).then(
                  res => {
                    if ( res )
                      router.navigate( [ 'm', 'perfil' ] )
                  }
                )
              }
              this.allStats = [
                {
                  tooltip: 'Amigos',
                  icon: 'person',
                  number: this.userData.friends
                },
                {
                  tooltip: 'Viajes',
                  icon: 'directions_bike',
                  number: this.userData.trips
                },
                {
                  tooltip: 'Logros',
                  icon: 'bubble_chart',
                  number: this.userData.challenges
                },
              ]
            } 
          }
        )
      }
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

  emitClose( ) {
    this.closing.emit( )
  }

}
