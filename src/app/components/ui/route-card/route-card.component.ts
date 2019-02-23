import { Component, OnInit, Input } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { User, DEFAULT_USER } from 'src/app/interfaces/user';
import { AlertService } from 'src/app/services/alert-service/alert.service';

@Component({
  selector: 'app-route-card',
  templateUrl: './route-card.component.html',
  styleUrls: ['./route-card.component.scss']
})
export class RouteCardComponent implements OnInit {

  @Input( ) data
  @Input( ) owner: boolean = false
  userInfo: User = DEFAULT_USER
  requestSent: boolean = false

  constructor( private db: AngularFirestore ) { }

  ngOnInit( ) {
    this.db.doc( this.data.data.owner ).valueChanges( ).subscribe( user => {
      this.userInfo = <User> user
    })
  }

  getRoutes( object: { key: number } ) {
    return Object.keys( object ).sort( ( a, b ) => {
      if ( object[ a ] < object[ b ] )
        return -1
      return 1
    })
  }

}
