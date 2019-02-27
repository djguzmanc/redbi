import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { User, DEFAULT_USER } from 'src/app/interfaces/user';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-route-card',
  templateUrl: './route-card.component.html',
  styleUrls: ['./route-card.component.scss']
})
export class RouteCardComponent implements OnInit, OnDestroy {

  @Input( ) data
  @Input( ) owner: boolean = false
  userInfo: User = DEFAULT_USER
  requestSent: boolean = false
  subscription = new Subscription( )
  subscribers: number = 0

  constructor( private db: AngularFirestore ) { }

  ngOnInit( ) {
    this.requestSent = true
    this.subscription.add(
      this.db.doc( this.data.data.owner ).valueChanges( ).subscribe( user => {
        this.userInfo = <User> user
        let routeRef = this.db.doc( this.db.collection( 'routes' ).doc( this.data.id ).ref.path ).ref
        this.subscription.add(
          this.db.collection( `users`, ref => ref.where( 'subscription', '==', routeRef ) ).valueChanges( ).subscribe( res => {
            this.requestSent = false
            this.subscribers = res.length
          })
        )
      })
    )
  }

  remainTimeText( ) {
    if ( this.data && this.data.data.departure_time ) {
      let secondsNow = ( new Date( ) ).getTime( ) / 1000
      let secondsDeparture = this.data.data.departure_time.seconds
  
      let difference = ( secondsDeparture - secondsNow ) / 60

      let time, day
      let today = new Date( )
      let departure = new Date( this.data.data.departure_time.seconds * 1000 )

      if ( today.getDate( ) == departure.getDate( ) && today.getMonth( ) == departure.getMonth( ) && today.getFullYear( ) == departure.getFullYear( ) )
        day = 'Hoy'
      else
        day = null
  
      if ( difference < 60 ) {
        time = Math.floor( difference ) + 'min'
      } else {
        difference = difference / 60
        time = Math.floor( difference ) + 'h'
      }

      return {
        day,
        time
      }
    }

    return {
      day: '-',
      time: '-'
    }
  }

  ngOnDestroy( ) {
    this.subscription.unsubscribe( )
  }

}
