import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

import swal from 'sweetalert';
import { MatSnackBar } from '@angular/material/snack-bar';
import { text } from '@angular/core/src/render3';

@Injectable({
  providedIn: 'root'
})
export class AlertService {

  constructor( private router: Router, private mtBar: MatSnackBar ) { }

  openSimpleSnack( msg: string, action: string ) {
    return this.mtBar.open( msg, action )
  }

  showInfoSnack( msg: string, action: string ) {
    this.mtBar.open( msg, action )
  }

  showInfoSwal( title: string, text: string ) {
    return swal({
      title,
      text,
      icon: 'info'
    })
  }

  showSuccessMessageSwal( title: string ) {
    return swal({
      title,
      icon: 'success',
      timer: 2000
    })
  }

  showConfirmSwal( title: string, text: string, dangermode?: boolean ) {
    return swal({
      title,
      text,
      icon: 'info',
      closeOnClickOutside: false,
      dangerMode: dangermode,
      buttons: {
        cancel: {
          text: "No",
          value: null,
          visible: true,
          className: "",
          closeModal: true,
        },
        confirm: {
          text: "Sí",
          value: true,
          visible: true,
          className: "",
          closeModal: true
        }
      }
    })
  }

  showErrorMessageSwal( title: string, text: string ) {
    return swal({
      title: title,
      text: text,
      icon: 'error',
      timer: 2000
    })
  }

  swalRef( ) {
    return swal
  }

  closeSwal( ) {
    swal.close( )
  }

  errorHandler( err, options ) {
    console.log( err )
    switch ( err.status ) {
      // case 401:
      //   this.showDeadSessionSwal( ).then(
      //     () => {
      //       if ( options.modal != undefined ) {
      //         options.modal.modal_toggler.click( )
      //         setTimeout( () => {
      //           this.dataService.logout( )
      //           this.dataService.updateRedirectTo( options.url )
      //           this.router.navigate( [ 'login' ] )
      //         }, 1000 )
      //       }
      //       else {
      //         this.dataService.logout( )
      //         this.dataService.updateRedirectTo( options.url )
      //         this.router.navigate( [ 'login' ] )
      //       }
      //     }
      //   ).catch(
      //     () => {
      //       if ( options.modal != undefined ) {
      //         options.modal.modal_toggler.click( )
      //         setTimeout( () => {
      //           this.dataService.logout( )
      //           this.dataService.updateRedirectTo( options.url )
      //           this.router.navigate( [ 'login' ] )
      //         }, 1000 )
      //       }
      //       else {
      //         this.dataService.logout( )
      //         this.dataService.updateRedirectTo( options.url )
      //         this.router.navigate( [ 'login' ] )
      //       }
      //     }
      //   )
      //   break
      case 0:
        this.showErrorMessageSwal( 'El servidor no ha respondido', 'Contacte a su administrador' ).catch(
          swal
        )
        break
      default:
        if ( !options.validations ) {
          // this.showSwal( 'default-error' )
        }
        else
          this.closeSwal( )
    }
    console.log( status )
    return null
  }

}
