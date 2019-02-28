import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { DataService } from 'src/app/services/data-service/data.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  wrongDomain: boolean = false

  constructor( private router: Router, private activatedRoute: ActivatedRoute, private dataService: DataService ) { }

  ngOnInit( ) {
    this.activatedRoute.queryParams.subscribe( ( params: Params ) => {
      if ( params.wrongDomain )
        this.wrongDomain = params.wrongDomain
    })
  }

  signIn( ) {
    this.router.navigate( [ 'do-login' ] )
  }

  showVideo( ) {
    this.dataService.videotutorial.next( true )
  }

}
