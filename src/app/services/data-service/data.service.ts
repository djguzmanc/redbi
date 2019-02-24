import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore } from '@angular/fire/firestore';
import { Subject } from 'rxjs';
import { User } from 'src/app/interfaces/user';

@Injectable({
  providedIn: 'root'
})
export class DataService {

  userData = new Subject<any>( )
  userDataValue: { userData: User, uid: string }

  constructor( private afAuth: AngularFireAuth, private db: AngularFirestore ) {
    this.afAuth.user.subscribe( res => {
      if ( res ) {
        this.db.doc( `users/${ res.uid }` ).valueChanges( ).subscribe( user => {
          let userData = {
            userData:  <User> user,
            uid: res.uid
          }
          this.userData.next( userData )
          this.userDataValue = userData
        })
      }
    })
  }
}
