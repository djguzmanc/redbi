import { Component, OnInit, OnDestroy } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Subscription } from 'rxjs';
import { DataService } from 'src/app/services/data-service/data.service';
import { FormGroup, FormControl } from '@angular/forms';
import { StaticDataService } from 'src/app/services/static-data/static-data.service';
import { AlertService } from 'src/app/services/alert-service/alert.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-partner-finder',
  templateUrl: './partner-finder.component.html',
  styleUrls: ['./partner-finder.component.scss']
})
export class PartnerFinderComponent implements OnInit, OnDestroy {

  allUsers = []
  subscription = new Subscription( )
  userData
  routeForm: FormGroup
  currentRoute
  invitationRequest: boolean = false

  constructor( private db: AngularFirestore, private dataService: DataService, public sdService: StaticDataService, private alertService: AlertService,
    private router: Router ) { }

  ngOnInit( ) {
    this.userData = this.dataService.userDataValue
    this.subscription.add(
      this.dataService.userData.asObservable( ).subscribe( newVal => {
        this.userData = newVal
        this.initData( )
      })
    )
    if ( this.userData ) {
      this.initData( )
    }
  }

  initData( ) {
    this.routeForm = new FormGroup({
      destination: new FormControl( this.userData.userData.preferences.location, [] )
    })

    let userRef = this.db.doc( this.db.collection( 'users' ).doc( this.userData.uid ).ref.path ).ref
    let routesSub$ = this.db.collection( 'routes', ref => ref.where( 'owner', '==', userRef ) ).snapshotChanges( ).subscribe( res => {
      let routes = res.map( x => {
        return {
          id: x.payload.doc.id,
          data: x.payload.doc.data( )
        }
      })

      for (let i = 0; i < routes.length; i++) {
        if ( !( <any> routes[ i ].data ).started ) {
          this.currentRoute = routes[ i ]
          break
        }          
      }
      if ( !this.currentRoute ) {
        this.alertService.showInfoSwal( 'No puedes enviar invitaciones', 'Para enviar invitaciones debes tener una ruta activa.' ).then( () => {
          this.router.navigate( [ 'm', 'crear-ruta' ] )
        })
        return
      }

      this.routeForm.get( 'destination' ).valueChanges.subscribe( val => {
        if ( val ) {
          this.subscription.add(
            this.db.collection( 'users', ref => ref.where( 'preferences.location', '==', this.routeForm.get( 'destination' ).value ).orderBy( 'fullName' ) )
              .snapshotChanges( ).subscribe( users => {
                console.log( users )
                this.allUsers = users.map( x => {
                  return {
                    id: x.payload.doc.id,
                    data: x.payload.doc.data( )
                  }
                }).filter( x => x.id != this.userData.uid )
            })
          )
        }
        else {
          this.subscription.add(
            this.db.collection( 'users', ref => ref.orderBy( 'fullName' ) )
              .snapshotChanges( ).subscribe( users => {
                console.log( users )
                this.allUsers = users.map( x => {
                  return {
                    id: x.payload.doc.id,
                    data: x.payload.doc.data( )
                  }
                }).filter( x => x.id != this.userData.uid )
              })
          )
        }
      })
  
      this.subscription.add(
        this.db.collection( 'users', ref => ref.where( 'preferences.location', '==', this.routeForm.get( 'destination' ).value ).orderBy( 'fullName' ) )
          .snapshotChanges( ).subscribe( users => {
            console.log( users )
            this.allUsers = users.map( x => {
              return {
                id: x.payload.doc.id,
                data: x.payload.doc.data( )
              }
            }).filter( x => x.id != this.userData.uid )
          })
      )

      routesSub$.unsubscribe( )
    })
  }

  sendInvitation( index: number ) {
    if ( !this.invitationRequest ) {
      this.invitationRequest = true
      let userRef = this.db.doc( this.db.collection( 'users' ).doc( this.userData.uid ).ref.path ).ref
      let routeRef = this.db.doc( this.db.collection( 'routes' ).doc( this.currentRoute.id ).ref.path ).ref
      this.db.doc( `users/${ this.allUsers[ index ].id }` ).collection( 'invitations' ).add({
        routeRef,
        userRef,
        created_at: new Date( ),
        read: false
      }).then( () => {
        this.invitationRequest = false
        this.alertService.openSimpleSnack( 'Invitación enviada', 'Ok' )
      }).catch( err => {
        this.invitationRequest = false
        this.alertService.openSimpleSnack( 'No se completó la invitación', 'Ok' )
      })
    }
  }

  ngOnDestroy( ) {
    this.subscription.unsubscribe( )
  }

}
