import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { StaticDataService } from 'src/app/services/static-data/static-data.service';
import { MatChipInputEvent, MatExpansionPanel } from '@angular/material';
import { AngularFirestore } from '@angular/fire/firestore';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { AlertService } from 'src/app/services/alert-service/alert.service';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { DataService } from 'src/app/services/data-service/data.service';

@Component({
  selector: 'app-new-route',
  templateUrl: './new-route.component.html',
  styleUrls: ['./new-route.component.scss']
})
export class NewRouteComponent implements OnInit, OnDestroy {

  readonly separatorKeysCodes: number[] = [ ENTER, COMMA ];

  route = []
  userData
  routeForm: FormGroup
  subscription = new Subscription( )
  requestSent: boolean = false

  dateControl: FormControl = new FormControl( new Date( ( new Date( ) ).getTime( ) + 65 * 60 * 1000 ), [ Validators.required ] )
  timeControl: FormControl = new FormControl( `${ this.dateControl.value.getHours( ) }:${ this.dateControl.value.getMinutes( ) }`, [ Validators.required ] )

  routesSub$
  @ViewChild( 'howto_ref' ) howto_ref: MatExpansionPanel

  constructor( public sdService: StaticDataService, private db: AngularFirestore, private dataService: DataService,
      private alertService: AlertService, private router: Router ) { }

  ngOnInit( ) {
    let h = this.dateControl.value.getHours( )
    let m = this.dateControl.value.getMinutes( )
    this.timeControl = new FormControl( `${ h < 10 ? '0' + h : h }:${ m < 10 ? '0' + m : m }`, [ Validators.required ] )

    this.userData = this.dataService.userDataValue
    this.subscription.add(
      this.dataService.userData.asObservable( ).subscribe( newVal => {
        this.userData = newVal
        this.initForm( )
      })
    )
    if ( this.userData ) {
      this.initForm( )
    }
  }

  retrieveRoutes( ) {
    if ( !this.routesSub$ ) {
      let userRef = this.db.doc( this.db.collection( 'users' ).doc( this.userData.uid ).ref.path ).ref
      this.requestSent = true
      this.routesSub$ = this.db.collection( 'routes', ref => ref.where( 'owner', '==', userRef ) ).snapshotChanges( ).subscribe( res => {
        let routes = res.map( x => {
          return {
            id: x.payload.doc.id,
            data: x.payload.doc.data( )
          }
        })

        for (let i = 0; i < routes.length; i++) {
          if ( !( <any> routes[ i ].data ).started ) {
            this.alertService.showInfoSwal( 'No puedes crear más rutas', 'En estos momentos tienes una ruta activa.' ).then( () => {
              this.router.navigate( [ 'm', 'mis-rutas' ] )
            })
            return
          }          
        }
        if( res.length == 0 ) {
          this.alertService.showInfoSwal( 
            '¡No tienes ninguna ruta!', 
            'Parece que es la primera vez que estás aquí. Tómate 5 minutos para leer la guía: ¿Cómo creo mi ruta?' 
          ).then( () => {
            this.howto_ref.open( )
          })
        }
        this.requestSent = false
        this.routesSub$.unsubscribe( )
      })
    }
  }

  initForm( ) {
    if ( this.userData.userData.subscription ) {
      this.alertService.showInfoSwal( 'No puedes crear una ruta', 'Para crear una ruta no debes tenes suscripciones activas.' ).then( () => {
        this.router.navigate( [ 'm', 'inicio' ] )
      })
      return
    }

    this.routeForm = new FormGroup({
      exit: new FormControl( this.userData.userData.preferences.exit_preference, [ Validators.required ] ),
      destination: new FormControl( this.userData.userData.preferences.location, [ Validators.required ] )
    })

    this.route = this.userData.userData.preferences.paths || []

    this.retrieveRoutes( )

    this.timeControl.valueChanges.subscribe( val => {
      if ( val && val != '' ) {
        let [ h, m ] = val.split( ':' )
        this.dateControl.value.setHours( Number( h ), Number( m ) )
      }
    })
    this.dateControl.valueChanges.subscribe( val => {
      let [ h, m ] = this.timeControl.value.split( ':' )
      let d = new Date( val )
      d.setHours( Number( h ), Number( m ) )
      this.dateControl.setValue( d, { emitEvent: false } )
    })
  }

  isFormValid( ) {
    return this.validateRoute( ) === -1 && !this.requestSent && this.dateControl.value && this.timeControl.value && this.route.length > 0 && this.routeForm.valid 
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
      if ( splittedPath.length > 3 )
        return i
    }
    return -1
  }

  createRoute( ) {
    if ( this.isFormValid( ) ) {

      let currentTime = new Date( )
      let difference = currentTime.getTime( ) - this.dateControl.value.getTime( )
      if ( difference > 0 ) {
        this.alertService.showInfoSwal( 'Revisa la fecha y hora de salida', 'Parece que intentas viajar al pasado.' )
        return
      } else {
        let hoursRemain = Math.abs( difference ) / 1000 / 3600
        if ( hoursRemain < .98 ) {
          this.alertService.showInfoSwal( 'Revisa la hora de salida', 'La creación de una ruta debe hacerse mínimo con una hora de anticipación a su salida.' )
          return
        }
      }

      this.requestSent = true
      let userRef = this.db.doc( this.db.collection( 'users' ).doc( this.userData.uid ).ref.path ).ref
      this.db.collection( 'routes' ).add(
        Object.assign({
          owner: userRef,
          paths: this.route.map( x => x.toLowerCase( ).normalize( 'NFD' ).replace( /[\u0300-\u036f]/g, "" ) ),
          departure_time: this.dateControl.value,
          created_at: new Date( ),
          started: false,
        }, this.routeForm.value )
      ).then( res => {
        this.db.collection( 'chat_rooms' ).add({
          route: this.db.doc( this.db.collection( 'routes' ).doc( res.id ).ref.path ).ref,
          messages: []
        })
        this.router.navigate( [ 'm', 'mis-rutas' ] )
      }).catch(
        err => {
          this.alertService.openSimpleSnack( 'Algo salió mal y tu ruta no fue creada :(', 'Ok' )
        }
      )
    }
  }

  ngOnDestroy( ) {
    this.subscription.unsubscribe( )
  }

}
