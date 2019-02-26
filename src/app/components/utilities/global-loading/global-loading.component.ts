import { Component, OnInit } from '@angular/core';
import { DataService } from 'src/app/services/data-service/data.service';
import { FADE_IN_OUT } from 'src/app/animations/animations';

@Component({
  selector: 'app-global-loading',
  templateUrl: './global-loading.component.html',
  styleUrls: ['./global-loading.component.scss'],
  animations: [
    FADE_IN_OUT
  ]
})
export class GlobalLoadingComponent implements OnInit {

  show: boolean = true

  constructor( private dataService: DataService ) {
    dataService.globalLoading.asObservable( ).subscribe( value => {
      this.show = value
    })
  }

  ngOnInit( ) {
  }

}
