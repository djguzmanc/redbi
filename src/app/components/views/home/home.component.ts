import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { AngularFirestore } from '@angular/fire/firestore';
import { DataService } from 'src/app/services/data-service/data.service';
import { AlertService } from 'src/app/services/alert-service/alert.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit, OnDestroy {

  subscription = new Subscription( )

  exit1Data
  exit2Data
  exit3Data
  exit4Data

  constructor( private db: AngularFirestore, private alertService: AlertService, 
    private router: Router, private dataService: DataService ) { }

  ngOnInit( ) {
    this.subscription.add(
      this.db.collection( 'routes', ref => ref.where( 'exit', '==', 'Por el Uriel' ) )
        .snapshotChanges( ).subscribe( res => {
          this.exit1Data =  res.length
        })
    )
    this.subscription.add(
      this.db.collection( 'routes', ref => ref.where( 'exit', '==', 'Por la 53' ) )
        .snapshotChanges( ).subscribe( res => {
          this.exit2Data =  res.length
        })
    )
    this.subscription.add(
      this.db.collection( 'routes', ref => ref.where( 'exit', '==', 'Por la 26' ) )
        .snapshotChanges( ).subscribe( res => {
          this.exit3Data =  res.length
        })
    )
    this.subscription.add(
      this.db.collection( 'routes', ref => ref.where( 'exit', '==', 'Por la 45' ) )
        .snapshotChanges( ).subscribe( res => {
          this.exit4Data =  res.length
        })
    )
  }

  find( exit: string ) {
    this.router.navigate( [ 'm', 'buscador' ], { queryParams: { exit } } )
  }

  ngOnDestroy( ) {
    this.subscription.unsubscribe( )
  }

}
