import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore } from '@angular/fire/firestore';
import { Subject } from 'rxjs';
import { User } from 'src/app/interfaces/user';
import { AlertService } from '../alert-service/alert.service';

@Injectable({
  providedIn: 'root'
})
export class DataService {

  userData = new Subject<any>( )
  userDataValue: { userData: User, uid: string }

  globalLoading = new Subject<any>( )

  version: string = '1.1.2'

  constructor( private afAuth: AngularFireAuth, private db: AngularFirestore, private alertService: AlertService ) {
    this.globalLoading.next( true )
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
      this.globalLoading.next( false )
    })

    if ( window.innerWidth > 375 ) {
      this.alertService.showInfoSwal( 
        'Recomendación', 
        'Recuerda que Redbi es una página web dirigida a dispositivos móviles, en un computador seguramente no se verá muy bien y la experiencia no sea la mejor, te invitamos a visitar la página desde cualquier navegador de tu teléfono móvil!' 
      )
    }

    this.db.doc( 'version/JbcQcMKiJMaxZ9RveRYN' ).valueChanges( ).subscribe( ( version: any ) => {
      if ( version.version != this.version )
        this.alertService.showErrorMessageSwal( 
          'Versión desactualizada', 
          `En este momento tienes una versión desactualizada de Redbi (v${ this.version }), vamos a recargar la página para actualizarla (v${ version.version }).` 
        ).then( () => {
          location.reload( )
        })
    })
  }
}
