import { Component, OnInit, EventEmitter, Output, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore } from '@angular/fire/firestore';
import { AlertService } from 'src/app/services/alert-service/alert.service';
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
  gettingMessages = false
  gettingMembers = false
  membersCount = 0

  constructor( public dataService: DataService, private db: AngularFirestore,
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

    let userRef = this.db.doc( this.db.collection( 'users' ).doc( this.userData.uid ).ref.path ).ref
    this.db.collection( 'routes', ref => ref.where( 'owner', '==', userRef ) ).snapshotChanges( ).subscribe( res => {
      let routes = res.map( x => {
        return {
          id: x.payload.doc.id,
          data: x.payload.doc.data( )
        }
      })

      for (let i = 0; i < routes.length; i++) {
        if ( !( <any> routes[ i ].data ).started ) {
          let routeRef = this.db.doc( this.db.collection( 'routes' ).doc( routes[ i ].id ).ref.path ).ref
          this.gettingMembers = true
          this.subscription.add(
            this.db.collection( 'users', ref => ref.where( 'subscription', '==', routeRef ) ).snapshotChanges( ).subscribe(
              res => {

                if ( this.gettingMembers ) {
                  this.membersCount = res.length
                } else if ( this.membersCount != res.length ) {
                  
                  const title = 'Redbi'
                  let options: any = {}
                  options.body = 'La lista de miembros para tu ruta activa ha sido actualizada.'
                  options.silent = false
                  options.icon = 'assets/images/icon.png'

                  let nt = new Notification( title, options )
                  this.membersCount = res.length
                }

                this.gettingMembers = false
              }
            )
          )

          this.gettingMessages = true
          this.db.collection( 'chat_rooms', ref => ref.where( 'route', '==', routeRef ) ).snapshotChanges( ).subscribe(
            ( res: any ) => {
              if ( res.length > 0 ) {
                let messages = res.map( x => {
                  return {
                    id: x.payload.doc.id,
                    data: x.payload.doc.data( )
                  }
                })[ 0 ]

                if ( !this.gettingMessages && messages.data.messages[ messages.data.messages.length - 1 ].owner.id != this.userData.uid &&
                    this.router.url.split( '/' )[ 2 ] != 'ruta' ) {

                  const title = 'Redbi'
                  let options: any = {}
                  options.body = 'Revisa tu ruta activa, podrías tener nuevos mensajes.'
                  options.silent = false
                  options.icon = 'assets/images/icon.png'

                  let nt = new Notification( title, options )
                }

                this.gettingMessages = false
              }
            }
          )
          return
        }          
      }
    })
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

  showVideotutorial( ) {
    this.dataService.videotutorial.next( true )
  }

  ngOnDestroy( ) {
    this.subscription.unsubscribe( )
  }

}
