import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { StaticDataService } from 'src/app/services/static-data/static-data.service';
import { MatChipInputEvent, MatExpansionPanel } from '@angular/material';
import { User, DEFAULT_USER } from 'src/app/interfaces/user';
import { AngularFireAuth } from '@angular/fire/auth';
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
  departure_time = new Date( )
  subscription = new Subscription( )

  routesSub$
  @ViewChild( 'howto_ref' ) howto_ref: MatExpansionPanel

  constructor( public sdService: StaticDataService, private db: AngularFirestore, private dataService: DataService,
      private alertService: AlertService, private router: Router ) { }

  ngOnInit( ) {
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
      this.routesSub$ = this.db.collection( 'routes', ref => ref.where( 'owner', '==', userRef ) ).snapshotChanges( ).subscribe( res => {
        if( res.length == 0 ) {
          this.alertService.showInfoSwal( 
            '¡No tienes ninguna ruta!', 
            'Parece que es la primera vez que estás aquí. Tómate 5 minutos para leer la guía: ¿Cómo creo mi ruta?' 
          ).then( () => {
            this.howto_ref.open( )
          })
        }
      })
      this.subscription.add( this.routesSub$ )
    }
  }

  initForm( ) {
    this.routeForm = new FormGroup({
      exit: new FormControl( this.userData.userData.preferences.exit_preference, [ Validators.required ] ),
      destination: new FormControl( this.userData.userData.preferences.location, [ Validators.required ] )
    })
    this.retrieveRoutes( )
  }

  isFormValid( ) {
    return this.departure_time && this.route.length > 0 && this.routeForm.valid 
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

  removePath( i: number ) {
    this.route.splice( i, 1 )
  }

  createRoute( ) {
    let userRef = this.db.doc( this.db.collection( 'users' ).doc( this.userData.uid ).ref.path ).ref
    this.db.collection( 'routes' ).add(
      Object.assign( {
        owner: userRef,
        paths: this.route,
        departure_time: this.departure_time,
        created_at: new Date( ),
      }, this.routeForm.value )
    ).then( res => {
      this.router.navigate( [ 'm', 'mis-rutas' ] )
    }).catch(
      err => {
        this.alertService.openSimpleSnack( 'Algo salió mal y tu ruta no fue creada :(', 'Ok' )
      }
    )
  }

  ngOnDestroy( ) {
    this.subscription.unsubscribe( )
  }

}
