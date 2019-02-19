import { Component, OnInit, OnDestroy } from '@angular/core';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { StaticDataService } from 'src/app/services/static-data/static-data.service';
import { MatChipInputEvent } from '@angular/material';
import { User, DEFAULT_USER } from 'src/app/interfaces/user';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore } from '@angular/fire/firestore';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { AlertService } from 'src/app/services/alert-service/alert.service';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-new-route',
  templateUrl: './new-route.component.html',
  styleUrls: ['./new-route.component.scss']
})
export class NewRouteComponent implements OnInit, OnDestroy {

  readonly separatorKeysCodes: number[] = [ ENTER, COMMA ];

  route = []

  userData: User = DEFAULT_USER
  uid: any

  routeForm: FormGroup

  departure_time = new Date( )

  subscription = new Subscription( )

  constructor( public sdService: StaticDataService, private afAuth: AngularFireAuth, private db: AngularFirestore,
      private alertService: AlertService, private router: Router ) { }

  ngOnInit( ) {
    this.subscription.add(
      this.afAuth.user.subscribe( data => {
        if ( data ) {
          this.uid = data.uid
          this.subscription.add(
            this.db.doc( `users/${ data.uid }` ).valueChanges( ).subscribe(
              ( res: User ) => {
                this.userData = res
                this.routeForm = new FormGroup({
                  exit: new FormControl( this.userData.preferences.exit_preference, [ Validators.required ] ),
                  destination: new FormControl( this.userData.preferences.location, [ Validators.required ] )
                })
              }
            )
          )
        }
      })
    )
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
    let userRef = this.db.doc( this.db.collection( 'users' ).doc( this.uid ).ref.path ).ref
    this.db.collection( 'routes' ).add(
      Object.assign( {
        owner: userRef,
        paths: this.route,
        departure_time: this.departure_time
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
