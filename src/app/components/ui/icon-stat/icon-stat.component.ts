import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-icon-stat',
  templateUrl: './icon-stat.component.html',
  styleUrls: ['./icon-stat.component.scss']
})
export class IconStatComponent implements OnInit {

  @Input( ) data

  constructor( ) { }

  ngOnInit( ) {
  }

}
