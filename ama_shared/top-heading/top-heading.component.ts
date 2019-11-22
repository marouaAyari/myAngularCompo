import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'top-heading',
  templateUrl: './top-heading.component.html',
  styleUrls: ['./top-heading.component.scss']
})
export class TopHeadingComponent implements OnInit {
@Input() heading ='';
  constructor() { }

  ngOnInit() {
  }

}
