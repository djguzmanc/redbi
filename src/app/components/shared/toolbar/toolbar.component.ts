import { Component, OnInit, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-toolbar',
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.scss']
})
export class ToolbarComponent implements OnInit {

  constructor() { }

  @Output( ) menuClicked = new EventEmitter( )

  ngOnInit( ) {
  }

  clickOnMenuIcon( ) {
    this.menuClicked.emit( )
  }

}
