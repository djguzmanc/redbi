import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { AngularFirestore } from '@angular/fire/firestore';
import { AlertService } from 'src/app/services/alert-service/alert.service';
import { DataService } from 'src/app/services/data-service/data.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-route-finder',
  templateUrl: './route-finder.component.html',
  styleUrls: ['./route-finder.component.scss']
})
export class RouteFinderComponent implements OnInit, OnDestroy {

  allRoutes
  routesSub$
  userData
  subscription = new Subscription( )

  constructor( private acRoute: ActivatedRoute, private db: AngularFirestore, 
    private alertService: AlertService, private router: Router, private dataService: DataService ) { }

  ngOnInit( ) {
    this.acRoute.queryParams.subscribe( ( params: Params ) => {
      this.retrieveRoutes( params.exit, params.destination, params.routes )
    })
  }

  retrieveRoutes( exit, destination, routes ) {
    if ( !this.routesSub$ ) {
      if ( ( destination || exit ) && !routes ) {
        this.routesSub$ = this.db.collection( 'routes', ref => {
            if ( destination && exit ) {
              console.log( "Por Destino y Salida!" )
              return ref.where( 'exit', '==', exit ).where( 'destination', '==', destination ).orderBy( 'created_at', 'desc' )
            }
            if ( destination ) {
              console.log( "Por Destino!" )
              return ref.where( 'destination', '==', destination ).orderBy( 'created_at', 'desc' )
            }
            if ( exit ) {
              console.log( "Por Salida!" )
              return ref.where( 'exit', '==', exit ).orderBy( 'created_at', 'desc' )
            }
          }).snapshotChanges( ).subscribe( res => {
            this.allRoutes =  res.map( x => {
              return {
                id: x.payload.doc.id,
                data: x.payload.doc.data( )
              }
            })
          })
        this.subscription.add( this.routesSub$ )
      }
    }
  }

  ngOnDestroy( ) {
    this.subscription.unsubscribe( )
  }

}
