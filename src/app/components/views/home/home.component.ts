import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { AngularFirestore } from '@angular/fire/firestore';
import { DataService } from 'src/app/services/data-service/data.service';
import { AlertService } from 'src/app/services/alert-service/alert.service';
import { Subscription } from 'rxjs';
import { StaticDataService } from 'src/app/services/static-data/static-data.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { MatChipInputEvent } from '@angular/material';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit, OnDestroy {

  readonly separatorKeysCodes: number[] = [ ENTER, COMMA ];

  subscription = new Subscription( )

  exit1Data
  exit2Data
  exit3Data
  exit4Data

  route = []
  userData
  routeForm: FormGroup

  constructor( private db: AngularFirestore, private alertService: AlertService, 
    private router: Router, private dataService: DataService, public sdService: StaticDataService ) { }

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

  isFormValid( ) {
    return this.validateRoute( ) === -1 && 
      this.routeForm && this.routeForm.valid 
        && ( this.routeForm.get( 'exit' ).value || this.routeForm.get( 'destination' ).value || this.route.length > 0 )
  }

  initForm( ) {
    this.routeForm = new FormGroup({
      exit: new FormControl( this.userData.userData.preferences.exit_preference, [] ),
      destination: new FormControl( this.userData.userData.preferences.location, [] )
    })

    let currentTime = new Date( )

    this.subscription.add(
      this.db.collection( 'routes', ref => ref.where( 'exit', '==', 'Por el Uriel' ).where( 'departure_time', '>', currentTime ) )
        .valueChanges( ).subscribe( res => {
          this.exit1Data =  res.filter( ( x: any ) => x.owner.id != this.userData.uid ).length
        })
    )
    this.subscription.add(
      this.db.collection( 'routes', ref => ref.where( 'exit', '==', 'Por la 53' ).where( 'departure_time', '>', currentTime ) )
        .valueChanges( ).subscribe( res => {
          this.exit2Data =  res.filter( ( x: any ) => x.owner.id != this.userData.uid ).length
        })
    )
    this.subscription.add(
      this.db.collection( 'routes', ref => ref.where( 'exit', '==', 'Por la 26' ).where( 'departure_time', '>', currentTime ) )
        .valueChanges( ).subscribe( res => {
          this.exit3Data =  res.filter( ( x: any ) => x.owner.id != this.userData.uid ).length
        })
    )
    this.subscription.add(
      this.db.collection( 'routes', ref => ref.where( 'exit', '==', 'Por la 45' ).where( 'departure_time', '>', currentTime ) )
        .valueChanges( ).subscribe( res => {
          this.exit4Data =  res.filter( ( x: any ) => x.owner.id != this.userData.uid ).length
        })
    )
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

  find( exit: string ) {
    this.router.navigate( [ 'm', 'buscador' ], { queryParams: { exit } } )
  }

  searchRoutes( ) {
    let exit = this.routeForm.get( 'exit' ).value
    let destination = this.routeForm.get( 'destination' ).value
    let routes = ''
    this.route.forEach( path => {
      routes += path + '_'
    })
    routes = routes.length > 0 ? routes.slice( 0, routes.length - 1 ) : undefined
    this.router.navigate( [ 'm', 'buscador' ], { queryParams: { exit, destination, routes } } )
  }

  ngOnDestroy( ) {
    this.subscription.unsubscribe( )
  }

}
