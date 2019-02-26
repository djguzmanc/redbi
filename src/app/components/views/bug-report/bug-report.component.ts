import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { DataService } from 'src/app/services/data-service/data.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { AngularFirestore } from '@angular/fire/firestore';
import { AlertService } from 'src/app/services/alert-service/alert.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-bug-report',
  templateUrl: './bug-report.component.html',
  styleUrls: ['./bug-report.component.scss']
})
export class BugReportComponent implements OnInit {

  userData
  subscription = new Subscription( )
  requestSent: boolean = false

  bugForm = new FormGroup({
    title: new FormControl( null, [ Validators.required ] ),
    description: new FormControl( null, [ Validators.required ] ),
  })

  constructor( private dataService: DataService, private db: AngularFirestore, private alertService: AlertService,
    private router: Router ) { }

  ngOnInit( ) {
    this.userData = this.dataService.userDataValue
    this.subscription.add(
      this.dataService.userData.asObservable( ).subscribe( newVal => {
        this.userData = newVal
      })
    )
  }

  isFormValid( ) {
    return !this.requestSent && this.bugForm.valid
  }

  sendReport( ) {
    this.requestSent = true
    this.db.collection( 'reports' ).add({
      name: this.userData.userData.fullName,
      email: this.userData.userData.email,
      report: this.bugForm.value
    }).then( () => {
      this.requestSent = false
      this.alertService.showInfoSwal( `Gracias ${ this.userData.userData.fullName.split( ' ' )[ 0 ] }`, 'Tu bug ha sido recibido y pronto será revisado :)' )
      .then( () => {
        this.router.navigate( [ 'm', 'inicio' ] )
      })
    }).catch( err => {
      this.alertService.openSimpleSnack( 'Tu reporte no se pudo enviar :(', 'Ok' )
    })
  }

}
