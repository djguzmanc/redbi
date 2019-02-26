import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-loading-icon',
  templateUrl: './loading-icon.component.html',
  styleUrls: ['./loading-icon.component.scss']
})
export class LoadingIconComponent implements OnInit {

  @Input( ) color: string = 'black'
  @Input( ) fontSize: number = 24

  constructor( ) { }

  ngOnInit()  {
  }

  customStyle( ) {
    return {
      'color': this.color,
      'font-size': this.fontSize
    }
  }

}
