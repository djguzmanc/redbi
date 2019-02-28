import { Component, OnInit } from '@angular/core';
import { DataService } from 'src/app/services/data-service/data.service';
import { FADE_IN_OUT } from 'src/app/animations/animations';

@Component({
  selector: 'app-video-tutorial',
  templateUrl: './video-tutorial.component.html',
  styleUrls: ['./video-tutorial.component.scss'],
  animations: [
    FADE_IN_OUT
  ]
})
export class VideoTutorialComponent implements OnInit {

  showVideo: boolean = false

  constructor( private dataService: DataService ) { }

  ngOnInit( ) {
    this.dataService.videotutorial.asObservable( ).subscribe( value => {
      this.showVideo = value
    })
  }

  hide( ) {
    this.dataService.videotutorial.next( false )
  }

}
