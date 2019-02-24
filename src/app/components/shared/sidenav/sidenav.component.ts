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
  routeSubscriptionData$
  routeData

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
    if ( !this.routeSubscriptionData$ ) {
      if ( this.userData.userData.subscription ) {
        this.routeSubscriptionData$ = this.db.doc( `routes/${ this.userData.userData.subscription.id }` ).valueChanges( ).subscribe( ( res: any ) => {
          if ( res.started ) {
            this.routeData = res
            this.alertService.showInfoSwal( 
              '¿Has llegado?', 
              'El líder de tu ruta ha iniciado el viaje, presiona "Ok" cuando hayas llegado a tu destino. Tu bienestar es importante para nosotros :)', 
              false 
            ).then( result => {
              if ( result ) {
                this.routeData.members[ this.userData.uid ].arrived = true
                this.routeSubscriptionData$.unsubscribe( )
                this.db.doc( `routes/${ this.userData.userData.subscription.id }` ).update({
                  members: this.routeData.members
                }).then( () => {
                  this.db.doc( `users/${ this.userData.uid }` ).update({
                    trips: this.userData.userData.trips + 1,
                    subscription: null
                  }).then( () => {
                    this.alertService.openSimpleSnack( 'Llegada registrada', 'Ok' )
                  })
                }).catch( err => {
                  this.alertService.openSimpleSnack( 'No hemos podido registrar tu llegada :(', 'Ok' )
                })
              }
            })
          }
        })
      } else {
        if ( this.routeSubscriptionData$ )
          this.routeSubscriptionData$.unsubscribe( )
      }
    }

    if ( ( this.userData.userData.faculty == null || this.userData.userData.gender == null || !this.userData.userData.preferences.edited ) && this.router.url != '/m/perfil' ) {
      this.alertService.showConfirmSwal( 'Parece que no has completado tus datos de perfil', '¿Deseas completarlos? Tomará 5 minutos :p' ).then(
        res => {
          if ( res ) {
            this.router.navigate( [ 'm', 'perfil' ] )
          }
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
