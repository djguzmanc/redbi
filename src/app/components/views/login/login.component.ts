import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  wrongDomain: boolean = false

  constructor( private router: Router, private activatedRoute: ActivatedRoute ) { }

  ngOnInit( ) {
    this.activatedRoute.queryParams.subscribe( ( params: Params ) => {
      if ( params.wrongDomain )
        this.wrongDomain = params.wrongDomain
    })
  }

  signIn( ) {
    this.router.navigate( [ 'do-login' ] )
  }

}
