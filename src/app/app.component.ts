import { Component } from '@angular/core';
import { DataService } from './services/data-service/data.service';
import { Router, NavigationEnd } from '@angular/router';
import { APPEARING_NO_DELAY } from './animations/animations';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  animations: [
    APPEARING_NO_DELAY
  ]
})
export class AppComponent {

  constructor( public dataService: DataService, public router: Router ) {
    router.events.subscribe( event => {
      if ( event instanceof NavigationEnd ) {
        window.scrollTo( 0, 0 )
      }
    });
  }

}
