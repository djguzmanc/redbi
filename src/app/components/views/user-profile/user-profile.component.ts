import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { Router } from '@angular/router';
import { AlertService } from 'src/app/services/alert-service/alert.service';
import { FormGroup, FormControl, Validators, Form } from '@angular/forms';
import { StaticDataService } from 'src/app/services/static-data/static-data.service';
import { Subscription } from 'rxjs';
import { DataService } from 'src/app/services/data-service/data.service';
import { MatTabGroup, MatChipInputEvent } from '@angular/material';
import { AngularFireStorage } from '@angular/fire/storage';
import { finalize } from 'rxjs/operators';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.scss']
})
export class UserProfileComponent implements OnInit, OnDestroy {

  userData
  personalDataForm: FormGroup
  preferencesForm: FormGroup
  subscription = new Subscription( )
  requestSent: boolean = false
  profilePicRequestSent: boolean = false
  @ViewChild( 'mattab_ref' ) mattab_ref: MatTabGroup

  route = []
  readonly separatorKeysCodes: number[] = [ ENTER, COMMA ];

  constructor( private db: AngularFirestore, public dataService: DataService, private fs: AngularFireStorage,
    private router: Router, private alertService: AlertService, public sdService: StaticDataService ) {}

  ngOnInit( ) {
    this.userData = this.dataService.userDataValue
    this.subscription.add(
      this.dataService.userData.asObservable( ).subscribe( newVal => {
        this.userData = newVal
        this.initForms( )
      })
    )
    if ( this.userData ) {
      this.initForms( )
    }
  }

  initForms( ) {
    this.personalDataForm = new FormGroup({
      faculty: new FormControl( this.userData.userData.faculty, [ Validators.required ] ),
      gender: new FormControl( this.userData.userData.gender, [ Validators.required ] ),
    })
    this.preferencesForm = new FormGroup({
      experience: new FormControl( this.userData.userData.preferences.experience, [ Validators.required ] ),
      hour_preference: new FormControl( this.userData.userData.preferences.hour_preference, [ Validators.required ] ),
      location: new FormControl( this.userData.userData.preferences.location, [ Validators.required ] ),
      medkit: new FormControl( this.userData.userData.preferences.medkit, [ Validators.required ] ),
      punch_out: new FormControl( this.userData.userData.preferences.punch_out, [ Validators.required ] ),
      road_preference: new FormControl( this.userData.userData.preferences.road_preference, [ Validators.required ] ),
      speed: new FormControl( this.userData.userData.preferences.speed, [ Validators.required ] ),
      exit_preference: new FormControl( this.userData.userData.preferences.exit_preference, [ Validators.required ] ),
    })
    this.route = this.userData.userData.preferences.paths || [] 
  }

  savePersonalData( ) {
    if ( this.personalDataForm.valid ) {
      this.requestSent = true
      this.db.doc( `users/${ this.userData.uid }` ).update( this.personalDataForm.value ).then(
        res => {
          this.requestSent = false
          this.alertService.showInfoSnack( '¡Datos actualizados!', 'Ok' )
          this.mattab_ref.selectedIndex = this.mattab_ref.selectedIndex + 1
        }
      )
    }
  }

  savePreferences( ) {
    if ( this.isPreferencesFormValid( ) ) {
      this.requestSent = true
      this.db.doc( `users/${ this.userData.uid }` ).update( { preferences: Object.assign( this.preferencesForm.value, { 
        edited : true,
        paths: this.route.map( x => x.toLowerCase( ).normalize( 'NFD' ).replace( /[\u0300-\u036f]/g, "" ) ),
       } ) } ).then(
        res => {
          this.requestSent = false
          this.alertService.showInfoSnack( '¡Datos actualizados!', 'Ok' )
        }
      )
    }
  }

  catchPhoto( e ) {
    if ( !this.profilePicRequestSent ) {
      this.profilePicRequestSent = true
      let filePath = 'user_profile_pics/' + this.db.createId( )
      if ( this.userData.userData.customPhoto )
        this.fs.ref( this.userData.userData.customPhoto.filePath ).delete( )
      this.fs.upload( filePath, e.target.files[ 0 ] ).snapshotChanges( ).pipe(
        finalize(() => {
          const ref = this.fs.ref( filePath )
          ref.getDownloadURL( ).subscribe( url => {
            this.db.doc( `users/${ this.userData.uid }` ).update({
              photoURL: url,
              customPhoto: {
                filePath
              }
            }).then( () => {
              this.profilePicRequestSent = false
              this.alertService.showInfoSnack( '¡Foto actualizada!', 'Ok' )
            }).catch( () => {
              this.profilePicRequestSent = false
              this.alertService.showInfoSnack( 'Algo salió mal y no se pudo actualizar tu foto :(', 'Ok' )
            })
          })
        })).subscribe( )
    }
  }

  isPreferencesFormValid( ) {
    return this.preferencesForm.valid && this.route.length > 0 && !this.requestSent
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

  openInputCatcher( input ) {
    if ( !this.profilePicRequestSent )
      input.click( )
  }

  ngOnDestroy( ) {
    this.subscription.unsubscribe( )
  }

}
