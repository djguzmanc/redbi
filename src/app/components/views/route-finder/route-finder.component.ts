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

  allRoutes: { id: string, data: any }[] = []
  routesSub$
  userData
  subscription = new Subscription( )
  requestSent: boolean = false

  constructor( private acRoute: ActivatedRoute, private db: AngularFirestore, 
    private alertService: AlertService, private router: Router, private dataService: DataService ) { }

  ngOnInit( ) {
    this.userData = this.dataService.userDataValue
    this.subscription.add(
      this.dataService.userData.asObservable( ).subscribe( newVal => {
        this.userData = newVal
        this.acRoute.queryParams.subscribe( ( params: Params ) => {
          this.retrieveRoutes( params.exit, params.destination, params.routes )
        })
      })
    )
    if ( this.userData ) {
      this.acRoute.queryParams.subscribe( ( params: Params ) => {
        this.retrieveRoutes( params.exit, params.destination, params.routes )
      })
    }
  }

  retrieveRoutes( exit, destination, routes ) {
    let currentTime = new Date( )
    if ( !this.routesSub$ ) {
      if ( ( destination || exit ) && !routes ) {
        this.requestSent = true
        this.routesSub$ = this.db.collection( 'routes', ref => {
            if ( destination && exit ) {
              console.log( "Por Destino y Salida!" )
              return ref.where( 'exit', '==', exit ).where( 'started', '==', false ).where( 'destination', '==', destination ).where( 'departure_time', '>', currentTime ).orderBy( 'departure_time' )
            } else if ( destination ) {
              console.log( "Por Destino!" )
              return ref.where( 'destination', '==', destination ).where( 'started', '==', false ).where( 'departure_time', '>', currentTime ).orderBy( 'departure_time' )
            } else if ( exit ) {
              console.log( "Por Salida!" )
              return ref.where( 'exit', '==', exit ).where( 'started', '==', false ).where( 'departure_time', '>', currentTime ).orderBy( 'departure_time' )
            }
          }).snapshotChanges( ).subscribe( res => {
            this.allRoutes =  res.map( x => {
              return {
                id: x.payload.doc.id,
                data: x.payload.doc.data( )
              }
            }).filter( ( x: any ) => x.data.owner.id != this.userData.uid )
            this.requestSent = false
          })
        this.subscription.add( this.routesSub$ )
      } else if ( ( destination || exit ) || routes ) {
        let allPaths = ( <string> routes ).split( '_' ).map( x => x.toLocaleLowerCase( ).normalize( 'NFD' ).replace( /[\u0300-\u036f]/g, "" ) )
        if ( destination && exit && routes ) {
          this.requestSent = true
          console.log( "Por Destino, Salida y Rutas!" )
          allPaths.forEach( path => {
            let sub = this.db.collection( 'routes', ref => {
              return ref.where( 'exit', '==', exit ).where( 'started', '==', false ).where( 'destination', '==', destination ).where( 'paths', 'array-contains', path ).where( 'departure_time', '>', currentTime ).orderBy( 'departure_time' )
              }).snapshotChanges( ).subscribe( res => {
                this.mergeResults( res.map( x => {
                  return {
                    id: x.payload.doc.id,
                    data: x.payload.doc.data( )
                  }
                }).filter( ( x: any ) => x.data.owner.id != this.userData.uid ) )
                sub.unsubscribe( )
                this.requestSent = false
              })
          })
        } else if ( destination && routes ) {
          this.requestSent = true
          console.log( "Por Destino y Rutas!" )
          allPaths.forEach( path => {
            let sub = this.db.collection( 'routes', ref => {
              return ref.where( 'destination', '==', destination ).where( 'started', '==', false ).where( 'paths', 'array-contains', path ).where( 'departure_time', '>', currentTime ).orderBy( 'departure_time' )
              }).snapshotChanges( ).subscribe( res => {
                this.mergeResults( res.map( x => {
                  return {
                    id: x.payload.doc.id,
                    data: x.payload.doc.data( )
                  }
                }).filter( ( x: any ) => x.data.owner.id != this.userData.uid ) )
                sub.unsubscribe( )
                this.requestSent = false
              })
          })
        } else if ( exit && routes ) {
          this.requestSent = true
          console.log( "Por Salida y Rutas!" )
          allPaths.forEach( path => {
            let sub = this.db.collection( 'routes', ref => {
              return ref.where( 'exit', '==', exit ).where( 'started', '==', false ).where( 'paths', 'array-contains', path ).where( 'departure_time', '>', currentTime ).orderBy( 'departure_time' )
              }).snapshotChanges( ).subscribe( res => {
                this.mergeResults( res.map( x => {
                  return {
                    id: x.payload.doc.id,
                    data: x.payload.doc.data( )
                  }
                }).filter( ( x: any ) => x.data.owner.id != this.userData.uid ) )
                sub.unsubscribe( )
                this.requestSent = false
              })
          })
        } else if ( routes ) {
          this.requestSent = true
          console.log( "Por Rutas!" )
          allPaths.forEach( path => {
            let sub = this.db.collection( 'routes', ref => {
              return ref.where( 'paths', 'array-contains', path ).where( 'started', '==', false ).where( 'departure_time', '>', currentTime ).orderBy( 'departure_time' )
              }).snapshotChanges( ).subscribe( res => {
                this.mergeResults( res.map( x => {
                  return {
                    id: x.payload.doc.id,
                    data: x.payload.doc.data( )
                  }
                }).filter( ( x: any ) => x.data.owner.id != this.userData.uid ) )
                sub.unsubscribe( )
                this.requestSent = false
              })
          })
        }
      }
    }
  }

  mergeResults( routes: { id: string, data: any }[] ) {
    for ( let i = 0; i < routes.length; i++ )
      if ( !this.allRoutes.find( x => x.id === routes[ i ].id ) )
        this.allRoutes.push( routes[ i ] )
    this.allRoutes.sort( ( a, b ) => {
      if ( a.data.departure_time < b.data.departure_time )
        return -1
      return 1
    })
  }

  ngOnDestroy( ) {
    this.subscription.unsubscribe( )
  }

}
