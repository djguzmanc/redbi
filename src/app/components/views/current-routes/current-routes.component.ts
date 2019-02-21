import { Component, OnInit, OnDestroy } from '@angular/core';
import { User, DEFAULT_USER } from 'src/app/interfaces/user';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore } from '@angular/fire/firestore';
import { AlertService } from 'src/app/services/alert-service/alert.service';
import { Router } from '@angular/router';
import { Subscription, Timestamp } from 'rxjs';
import { DataService } from 'src/app/services/data-service/data.service';

@Component({
  selector: 'app-current-routes',
  templateUrl: './current-routes.component.html',
  styleUrls: ['./current-routes.component.scss']
})
export class CurrentRoutesComponent implements OnInit, OnDestroy {

  userData
  subscription = new Subscription( )
  allRoutes = []

  routesSub$

  constructor( private db: AngularFirestore, private alertService: AlertService, private router: Router, 
    private dataService: DataService ) { }

  ngOnInit( ) {
    this.userData = this.dataService.userDataValue
    this.subscription.add(
      this.dataService.userData.asObservable( ).subscribe( newVal => {
        this.userData = newVal
        this.retrieveRoutes( )
      })
    )
    if ( this.userData ) {
      this.retrieveRoutes( )
    }
  }

  retrieveRoutes( ) {
    if ( !this.routesSub$ ) {
      let userRef = this.db.doc( this.db.collection( 'users' ).doc( this.userData.uid ).ref.path ).ref
      this.routesSub$ = this.db.collection( 'routes', ref => ref.where( 'owner', '==', userRef ) ).snapshotChanges( ).subscribe( res => {
        this.allRoutes =  res.map( x => {
          return {
            id: x.payload.doc.id,
            data: x.payload.doc.data( )
          }
        }).sort( ( a: any, b: any ) => {
          let a_date = new Date( a.data.created_at.seconds * 1000 )
          let b_date = new Date( b.data.created_at.seconds * 1000 )
          return a_date < b_date ? 1 : -1
        })
        console.log( this.allRoutes )
      })
      this.subscription.add( this.routesSub$ )
    }
  }

  ngOnDestroy( ) {
    this.subscription.unsubscribe( )
  }

}
