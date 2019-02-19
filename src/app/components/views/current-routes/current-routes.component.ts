import { Component, OnInit, OnDestroy } from '@angular/core';
import { User, DEFAULT_USER } from 'src/app/interfaces/user';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore } from '@angular/fire/firestore';
import { AlertService } from 'src/app/services/alert-service/alert.service';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-current-routes',
  templateUrl: './current-routes.component.html',
  styleUrls: ['./current-routes.component.scss']
})
export class CurrentRoutesComponent implements OnInit, OnDestroy {

  userData: User = DEFAULT_USER
  uid: any

  subscription = new Subscription( )

  constructor( private afAuth: AngularFireAuth, private db: AngularFirestore,
    private alertService: AlertService, private router: Router ) { }

  ngOnInit( ) {
    this.subscription.add(
      this.afAuth.user.subscribe( data => {
        if ( data ) {
          this.uid = data.uid
          this.subscription.add(
            this.db.doc( `users/${ data.uid }` ).valueChanges( ).subscribe(
              ( res: User ) => {
                this.userData = res
                let userRef = this.db.doc( this.db.collection( 'users' ).doc( this.uid ).ref.path ).ref
                this.subscription.add(
                  this.db.collection( 'routes', ref => {
                    return ref.where( 'owner', '==', userRef )
                  }).snapshotChanges( ).subscribe( res => {
                    console.log( res )
                  })
                )
              }
            )
          )
        }
      })
    )
  }

  ngOnDestroy( ) {
    this.subscription.unsubscribe( )
  }

}
