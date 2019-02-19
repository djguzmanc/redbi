import { Component, OnInit, OnDestroy } from '@angular/core';
import { User, DEFAULT_USER } from 'src/app/interfaces/user';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore } from '@angular/fire/firestore';
import { Router } from '@angular/router';
import { AlertService } from 'src/app/services/alert-service/alert.service';
import { FormGroup, FormControl, Validators, Form } from '@angular/forms';
import { StaticDataService } from 'src/app/services/static-data/static-data.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.scss']
})
export class UserProfileComponent implements OnInit, OnDestroy {

  userData: User = DEFAULT_USER
  uid: any

  personalDataForm: FormGroup
  preferencesForm: FormGroup

  subscription = new Subscription( )

  constructor( private afAuth: AngularFireAuth, private db: AngularFirestore, 
    private router: Router, private alertService: AlertService, public sdService: StaticDataService ) {}

  ngOnInit( ) {
    this.subscription.add(
      this.afAuth.user.subscribe( data => {
        if ( data ) {
          this.uid = data.uid
          this.subscription.add(
            this.db.doc( `users/${ data.uid }` ).valueChanges( ).subscribe(
              ( res: User ) => {
                this.userData = res
                this.personalDataForm = new FormGroup({
                  faculty: new FormControl( this.userData.faculty, [ Validators.required ] ),
                  gender: new FormControl( this.userData.gender, [ Validators.required ] ),
                })
                this.preferencesForm = new FormGroup({
                  experience: new FormControl( this.userData.preferences.experience, [ Validators.required ] ),
                  location: new FormControl( this.userData.preferences.location, [ Validators.required ] ),
                  medkit: new FormControl( this.userData.preferences.medkit, [ Validators.required ] ),
                  punch_out: new FormControl( this.userData.preferences.punch_out, [ Validators.required ] ),
                  road_preference: new FormControl( this.userData.preferences.road_preference, [ Validators.required ] ),
                  speed: new FormControl( this.userData.preferences.speed, [ Validators.required ] ),
                  exit_preference: new FormControl( this.userData.preferences.exit_preference, [ Validators.required ] ),
                })
              }
            )
          )
        }
      })
    )
  }

  savePersonalData( ) {
    if ( this.personalDataForm.valid ) {
      this.db.doc( `users/${ this.uid }` ).update( this.personalDataForm.value ).then(
        res => {
          this.alertService.showInfoSnack( '¡Datos actualizados!', 'Ok' )
        }
      )
    }
  }

  savePreferences( ) {
    if ( this.preferencesForm.valid ) {
      this.db.doc( `users/${ this.uid }` ).update( { preferences: Object.assign( this.preferencesForm.value, { edited : true } ) } ).then(
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
