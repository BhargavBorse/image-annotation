import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-xml-structure',
  templateUrl: './xml-structure.component.html',
  styleUrls: ['./xml-structure.component.scss']
})
export class XmlStructureComponent implements OnInit {

  @Input() hero;
  constructor() { }

  ngOnInit(): void {
    console.warn(this.hero);
  }

}
