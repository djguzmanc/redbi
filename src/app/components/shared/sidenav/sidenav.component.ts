import { Component, OnInit, EventEmitter, Output, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore } from '@angular/fire/firestore';

import swal from 'sweetalert';
import { AlertService } from 'src/app/services/alert-service/alert.service';
import { User, DEFAULT_USER } from 'src/app/interfaces/user';
import { Subscription } from 'rxjs';
import { DataService } from 'src/app/services/data-service/data.service';

@Component({
  selector: 'app-sidenav',
  templateUrl: './sidenav.component.html',
  styleUrls: ['./sidenav.component.scss']
})
export class SidenavComponent implements OnInit, OnDestroy {

  userData
  @Output( ) closing = new EventEmitter( )

  subscription = new Subscription( )

  allStats = []

  constructor( private dataService: DataService, private db: AngularFirestore, 
    private router: Router, private alertService: AlertService, private afAuth: AngularFireAuth ) { }

  ngOnInit( ) {
    this.userData = this.dataService.userDataValue
    this.subscription.add(
      this.dataService.userData.asObservable( ).subscribe( newVal => {
        this.userData = newVal
        this.init( )
      })
    )
    if ( this.userData ) {
      this.init( )
    }
  }

  init( ) {
    if ( this.userData.userData.faculty == null || this.userData.userData.gender == null || !this.userData.userData.preferences.edited ) {
      this.alertService.showConfirmSwal( 'Parece que no has completado tus datos de perfil', '¿Deseas completarlos? Tomará 5 minutos :p' ).then(
        res => {
          if ( res )
            this.router.navigate( [ 'm', 'perfil' ] )
        }
      )
    }
    this.allStats = [
      {
        tooltip: 'Amigos',
        icon: 'person',
        number: this.userData.userData.friends
      },
      {
        tooltip: 'Viajes',
        icon: 'directions_bike',
        number: this.userData.userData.trips
      },
      {
        tooltip: 'Logros',
        icon: 'bubble_chart',
        number: this.userData.userData.challenges
      },
    ]
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

  ngOnDestroy( ) {
    this.subscription.unsubscribe( )
  }

}
