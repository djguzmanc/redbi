import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore } from '@angular/fire/firestore';
import { Subject } from 'rxjs';
import { User } from 'src/app/interfaces/user';
import { AlertService } from '../alert-service/alert.service';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class DataService {

  userData = new Subject<any>( )
  userDataValue: { userData: User, uid: string }

  globalLoading = new Subject<any>( )
  videotutorial = new Subject<any>( )

  version: string = '1.2.0'

  constructor( private afAuth: AngularFireAuth, private db: AngularFirestore, private alertService: AlertService,
    private router: Router ) {
    this.globalLoading.next( true )
    this.globalLoading.next( false )
    this.afAuth.user.subscribe( res => {
      if ( res ) {
        this.db.doc( `users/${ res.uid }` ).valueChanges( ).subscribe( user => {
          let userData = {
            userData:  <User> user,
            uid: res.uid
          }
          this.userData.next( userData )
          this.userDataValue = userData

          Notification.requestPermission( ).then( permission => {
            if ( permission == 'granted' ) {
              this.showWelcomeNotification( )
            }
          })
        })
      }
      this.globalLoading.next( false )
    })

    if ( window.innerWidth > 525 ) {
      this.alertService.showInfoSwal( 
        'Recomendación', 
        'Recuerda que Redbi es una página web dirigida a dispositivos móviles, en un computador seguramente no se verá muy bien y la experiencia no sea la mejor, te invitamos a visitar la página desde cualquier navegador de tu teléfono móvil!' 
      )
    }

    this.db.doc( 'version/JbcQcMKiJMaxZ9RveRYN' ).valueChanges( ).subscribe( ( version: any ) => {
      if ( version.version != this.version ) {
        localStorage.clear( )
        this.alertService.showErrorMessageSwal( 
          'Versión desactualizada', 
          `En este momento tienes una versión desactualizada de Redbi (v${ this.version }), vamos a recargar la página para actualizarla (v${ version.version }).` 
        ).then( () => {
          location.reload( )
        })
      }
    })
  }

  showWelcomeNotification( ) {
    if( this.userDataValue.userData.firstTime || this.userDataValue.userData.firstTime == null || this.userDataValue.userData.firstTime == undefined ) {
      const title = 'Redbi'
      let options: any = {}
      options.body = '¡Bienvenido a Redbi!'
      options.silent = false
      options.icon = 'assets/images/icon.png'

      let nt = new Notification( title, options ).onshow = () => {
        this.db.doc( `users/${ this.userDataValue.uid }` ).update({
          firstTime: false
        })
      }
    }
  }

  logout( ) {
    this.afAuth.auth.signOut( ).then( () => {
      localStorage.clear( )
      this.router.navigate( [ 'iniciar-sesion' ] ).then( () => {
        this.userData.next( null )
        this.userDataValue = null
      })
    })
  }
}
