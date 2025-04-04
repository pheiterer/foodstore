import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-title',
  templateUrl: './title.component.html',
  styleUrls: ['./title.component.css']
})
export class TitleComponent implements OnInit {

  constructor() { }

  @Input()
  title!: string;

  @Input()
  margin? = "1rem 0 1rem .2rem";

  @Input()
  fontSize? = "2rem";

  ngOnInit(): void {
  }

}
