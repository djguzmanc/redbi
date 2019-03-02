import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { CanActivate } from '@angular/router';
import { Observable } from 'rxjs';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore } from '@angular/fire/firestore';
import { DataService } from '../services/data-service/data.service';

@Injectable({
  providedIn: 'root'
})
export class ReverseAuthGuard implements CanActivate {
  
  constructor( private auth: AngularFireAuth, private router: Router, private db: AngularFirestore, private dateService: DataService ) {}

  canActivate( ): Observable<boolean> | boolean {
    this.auth.authState.subscribe( data => {
      if ( !data ) {
        this.dateService.logout( )
        return false
      }
    })
    return true
  }

}
