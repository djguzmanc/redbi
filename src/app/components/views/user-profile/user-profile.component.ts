import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Router } from '@angular/router';
import { AlertService } from 'src/app/services/alert-service/alert.service';
import { FormGroup, FormControl, Validators, Form } from '@angular/forms';
import { StaticDataService } from 'src/app/services/static-data/static-data.service';
import { Subscription } from 'rxjs';
import { DataService } from 'src/app/services/data-service/data.service';
import { MatTabGroup } from '@angular/material';

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
  @ViewChild( 'mattab_ref' ) mattab_ref: MatTabGroup

  constructor( private db: AngularFirestore, private dataService: DataService,
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
      location: new FormControl( this.userData.userData.preferences.location, [ Validators.required ] ),
      medkit: new FormControl( this.userData.userData.preferences.medkit, [ Validators.required ] ),
      punch_out: new FormControl( this.userData.userData.preferences.punch_out, [ Validators.required ] ),
      road_preference: new FormControl( this.userData.userData.preferences.road_preference, [ Validators.required ] ),
      speed: new FormControl( this.userData.userData.preferences.speed, [ Validators.required ] ),
      exit_preference: new FormControl( this.userData.userData.preferences.exit_preference, [ Validators.required ] ),
    })
  }

  savePersonalData( ) {
    if ( this.personalDataForm.valid ) {
      this.db.doc( `users/${ this.userData.uid }` ).update( this.personalDataForm.value ).then(
        res => {
          this.alertService.showInfoSnack( '¡Datos actualizados!', 'Ok' )
          this.mattab_ref.selectedIndex = this.mattab_ref.selectedIndex + 1
        }
      )
    }
  }

  savePreferences( ) {
    if ( this.preferencesForm.valid ) {
      this.db.doc( `users/${ this.userData.uid }` ).update( { preferences: Object.assign( this.preferencesForm.value, { edited : true } ) } ).then(
        res => {
          this.alertService.showInfoSnack( '¡Datos actualizados!', 'Ok' )
        }
      )
    }
  }

  ngOnDestroy( ) {
    this.subscription.unsubscribe( )
  }

}
