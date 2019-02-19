import { Component, OnInit } from '@angular/core';
import { User, DEFAULT_USER } from 'src/app/interfaces/user';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore } from '@angular/fire/firestore';
import { Router } from '@angular/router';
import { AlertService } from 'src/app/services/alert-service/alert.service';
import { FormGroup, FormControl, Validators, Form } from '@angular/forms';
import { StaticDataService } from 'src/app/services/static-data/static-data.service';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.scss']
})
export class UserProfileComponent implements OnInit {

  userData: User = DEFAULT_USER
  uid: any

  personalDataForm: FormGroup

  constructor( private afAuth: AngularFireAuth, private db: AngularFirestore, 
    private router: Router, private alertService: AlertService, public sdService: StaticDataService ) {}

  ngOnInit( ) {
    this.afAuth.user.subscribe( data => {
      if ( data ) {
        this.uid = data.uid
        this.db.doc( `users/${ data.uid }` ).valueChanges( ).subscribe(
          ( res: User ) => {
            this.userData = res
            this.personalDataForm = new FormGroup({
              faculty: new FormControl( this.userData.faculty, [ Validators.required ] ),
              gender: new FormControl( this.userData.gender, [ Validators.required ] ),
            })
          }
        )
      }
    })
  }

  savePersonalData( ) {
    if ( this.personalDataForm.valid ) {
      this.db.doc( `users/${ this.uid }` ).update( this.personalDataForm.value ).then(
        res => {
          this.alertService.showSuccessMessageSwal( '¡Datos Actualizados!' )
        }
      )
    }
  }

}
