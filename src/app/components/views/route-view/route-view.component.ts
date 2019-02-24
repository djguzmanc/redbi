import { Component, OnInit, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { Subscription } from 'rxjs';
import { DataService } from 'src/app/services/data-service/data.service';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { AngularFirestore } from '@angular/fire/firestore';
import { DEFAULT_USER } from 'src/app/interfaces/user';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { StaticDataService } from 'src/app/services/static-data/static-data.service';
import { MatChipInputEvent, MatExpansionPanel } from '@angular/material';
import { AlertService } from 'src/app/services/alert-service/alert.service';

@Component({
  selector: 'app-route-view',
  templateUrl: './route-view.component.html',
  styleUrls: ['./route-view.component.scss']
})
export class RouteViewComponent implements OnInit, OnDestroy {

  @ViewChild( 'messages_container_ref' ) messages_container_ref: ElementRef
  @ViewChild( 'members_panel_ref' ) members_panel_ref: MatExpansionPanel

  readonly separatorKeysCodes: number[] = [ ENTER, COMMA ];

  userData
  subscription = new Subscription( )
  routeData
  routeForm: FormGroup
  isOwner: boolean
  departure_time: Date
  requestSent: boolean = false
  ownerData
  route = []
  membersData = []
  messages = {
    id: -1,
    data: {
      messages: []
    }
  }

  constructor( private dataService: DataService, private acRoute: ActivatedRoute, private db: AngularFirestore, public sdService: StaticDataService,
      private alertService: AlertService, private router: Router ) { }

  ngOnInit( ) {
    this.userData = this.dataService.userDataValue
    this.subscription.add(
      this.dataService.userData.asObservable( ).subscribe( newVal => {
        this.userData = newVal
        this.retrieveRouteData( )
      })
    )
    if ( this.userData ) {
      this.retrieveRouteData( )
    }
  }

  initForm( ) {
    this.routeForm = new FormGroup({
      exit: new FormControl( this.routeData.exit, [ Validators.required ] ),
      destination: new FormControl( this.routeData.destination, [ Validators.required ] )
    })
    this.departure_time = new Date( this.routeData.departure_time.seconds * 1000 )
    this.route = this.routeData.paths
  }

  retrieveRouteData( ) {
    this.subscription.add(
      this.db.doc( `routes/${ this.acRoute.snapshot.paramMap.get( 'id' ) }` ).valueChanges( ).subscribe( res => {
        if ( res ) {
          this.routeData = res
          this.isOwner = this.routeData.owner.id == this.userData.uid
          if( this.isOwner )
            this.initForm( )
          if ( !this.isOwner ) {
            this.subscription.add(
              this.db.doc( this.routeData.owner ).valueChanges( ).subscribe( res => {
                this.ownerData = res 
              })
            )
          }
          let routeRef = this.db.doc( this.db.collection( 'routes' ).doc( this.acRoute.snapshot.paramMap.get( 'id' ) ).ref.path ).ref
          this.subscription.add(
            this.db.collection( 'users', ref => ref.where( 'subscription', '==', routeRef ) ).snapshotChanges( ).subscribe(
              res => {
                this.membersData = res.map( x => {
                  return {
                    id: x.payload.doc.id,
                    data: x.payload.doc.data( )
                  }
                })
              }
            )
          )
          this.subscription.add(
            this.db.collection( 'chat_rooms', ref => ref.where( 'route', '==', routeRef ) ).snapshotChanges( ).subscribe(
              ( res: any ) => {
                if ( res.length > 0 ) {
                  this.messages = res.map( x => {
                    return {
                      id: x.payload.doc.id,
                      data: x.payload.doc.data( )
                    }
                  })[ 0 ]
                  if ( !this.routeData.started )
                    this.messages_container_ref.nativeElement.scrollTop = this.messages_container_ref.nativeElement.scrollHeight
                }
              }
            )
          )
        }
      })
    )
  }

  isFormValid( ) {
    return this.validateRoute( ) === -1 && !this.requestSent && this.departure_time && this.route.length > 0 && this.routeForm.valid 
  }

  add( event: MatChipInputEvent, j: number ): void {
    const input = event.input;
    const value = event.value;

    if ( ( value || '' ).trim( ) ) {
      this.route.push( value.trim( ) );
    }

    if ( input ) {
      input.value = '';
    }
  }

  remove( j: number ): void {
    this.route.splice( j, 1 )
  }

  validateRoute( ) {
    for ( let i = 0; i < this.route.length; i++ ) {
      const path = this.route[ i ];
      let splittedPath = path.split( ' ' )
      if ( splittedPath.length > 2 )
        return i
    }
    return -1
  }

  updateRoute( ) {
    if ( this.isFormValid( ) ) {
      this.requestSent = true
      let userRef = this.db.doc( this.db.collection( 'users' ).doc( this.userData.uid ).ref.path ).ref
      this.db.doc( `routes/${ this.acRoute.snapshot.paramMap.get( 'id' ) }` ).update(
        Object.assign({
          owner: userRef,
          paths: this.route.map( x => x.toLowerCase( ).normalize( 'NFD' ).replace( /[\u0300-\u036f]/g, "" ) ),
          departure_time: this.departure_time,
        }, this.routeForm.value )
      ).then( res => {
        this.alertService.openSimpleSnack( 'Ruta actualizada', 'Ok' )
        this.requestSent = false
      }).catch(
        err => {
          this.alertService.openSimpleSnack( 'Algo salió mal y tu ruta no fue actualizada :(', 'Ok' )
          this.requestSent = false
        }
      )
    }
  }
  
  getOwnerData( ) {
    if ( this.isOwner && this.userData )
      return this.userData.userData
    if ( this.ownerData && !this.isOwner )
      return this.ownerData
    return DEFAULT_USER
  }

  deleteRoute( ) {
    if ( !this.requestSent ) {
      this.alertService.showConfirmSwal( '¿Estás seguro?', 'Esta acción no se puede deshacer.', true ).then( result => {
        if ( result ) {
          this.requestSent = true
          this.db.doc( `routes/${ this.acRoute.snapshot.paramMap.get( 'id' ) }` ).delete( ).then( () => {
            this.db.doc( `chat_rooms/${ this.messages.id }` ).delete( ).then( () => {
              this.alertService.openSimpleSnack( 'Ruta Eliminada', 'Ok' )
              this.router.navigate( [ 'm', 'mis-rutas' ] )
            }).catch( err => {
              this.alertService.openSimpleSnack( 'Algo salió mal', 'Ok' )
              this.requestSent = false
            })
          }).catch( err => {
            this.alertService.openSimpleSnack( 'Algo salió mal y tu ruta no fue eliminada', 'Ok' )
            this.requestSent = false
          })
        }
      })
    }
  }

  joinRoute( ) {
    if ( !this.requestSent ) {
      this.requestSent = true
      if ( !this.subscribedToThisRoute( ) ) {
        this.db.doc( `users/${ this.userData.uid }` ).update({
          subscription: this.db.doc( this.db.collection( 'routes' ).doc( this.acRoute.snapshot.paramMap.get( 'id' ) ).ref.path ).ref
        }).then( res => {
          this.alertService.openSimpleSnack( 'Te uniste a esta ruta! :)', 'Ok' )
          this.requestSent = false
        }).catch(
          err => {
            this.alertService.openSimpleSnack( 'Algo salió mal y no te pudiste unir :(', 'Ok' )
            this.requestSent = false
          }
        )
      } else {
        this.db.doc( `users/${ this.userData.uid }` ).update({
          subscription: null
        }).then( res => {
          this.alertService.openSimpleSnack( 'Abandonaste esta ruta! :)', 'Ok' )
          this.requestSent = false
        }).catch(
          err => {
            this.alertService.openSimpleSnack( 'Algo salió mal y no pudiste abandonar :(', 'Ok' )
            this.requestSent = false
          }
        )
      }
    }
  }

  subscribedToThisRoute( ) {
    return this.userData.userData.subscription && this.userData.userData.subscription.id === this.acRoute.snapshot.paramMap.get( 'id' )
  }

  sendMessage( msg ) {
    if ( msg.value && msg.value != '' ) {
      this.messages.data.messages.push({
        owner: {
          id: this.userData.uid,
          photoURL: this.userData.userData.photoURL,
          name: this.userData.userData.fullName.split( ' ', 2 ).join( ' ' )
        },
        msg: msg.value
      })
      this.db.doc( `chat_rooms/${ this.messages.id }` ).update({
        messages: this.messages.data.messages
      }).then( () => {
        msg.value = ''
        msg.blur( );
      })
    }
  }

  startTrip( ) {
    if ( !this.requestSent ) {
      this.alertService.showConfirmSwal( '¿Todos Listos?', '' ).then( result => {
        if ( result ) {
          this.requestSent = true
          let membersArriveData = {}
          this.membersData.forEach( member => {
            console.log( member )
            membersArriveData[ member.id ] = {
              fullName: member.data.fullName,
              photoURL: member.data.photoURL,
              arrived: false,
              faculty: member.data.faculty
            }
          })
          membersArriveData[ this.userData.uid ] = {
            fullName: this.userData.userData.fullName,
            photoURL: this.userData.userData.photoURL,
            arrived: false,
            leader: true,
            faculty: this.userData.userData.faculty
          }
          this.db.doc( `routes/${ this.acRoute.snapshot.paramMap.get( 'id' ) }` ).update({
            members: membersArriveData,
            started: true
          }).then( () => {
            this.requestSent = false
            this.members_panel_ref.open( )
            this.alertService.openSimpleSnack( 'Tu viaje ha iniciado :)', 'Ok' )
          }).catch( err => {
            this.requestSent = false
            this.alertService.openSimpleSnack( 'No hemos podido iniciar tu viaje :(', 'Ok' )
          })
        }
      })
    }
  }

  getObjectMembers( ) {
    return Object.values( this.routeData.members )
  }

  haveArrived( ) {
    if ( !this.requestSent ) {
      this.requestSent = true
      this.routeData.members[ this.userData.uid ].arrived = true
      this.db.doc( `routes/${ this.acRoute.snapshot.paramMap.get( 'id' ) }` ).update({
        members: this.routeData.members
      }).then( () => {
        this.db.doc( `users/${ this.userData.uid }` ).update({
          trips: this.userData.userData.trips + 1,
          subscription: null
        }).then( () => {
          this.requestSent = false
          this.alertService.openSimpleSnack( 'Llegada registrada', 'Ok' )
        })
      }).catch( err => {
        this.requestSent = false
        this.alertService.openSimpleSnack( 'No hemos podido registrar tu llegada :(', 'Ok' )
      })
    }
  }

  ngOnDestroy( ) {
    this.subscription.unsubscribe( )
  }

}
