import { Component, OnInit, Input } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { User, DEFAULT_USER } from 'src/app/interfaces/user';

@Component({
  selector: 'app-route-card',
  templateUrl: './route-card.component.html',
  styleUrls: ['./route-card.component.scss']
})
export class RouteCardComponent implements OnInit {

  @Input( ) data
  userInfo: User = DEFAULT_USER

  constructor( private db: AngularFirestore ) { }

  ngOnInit( ) {
    this.db.doc( this.data.data.owner ).valueChanges( ).subscribe( user => {
      this.userInfo = <User> user
    })
  }

}
