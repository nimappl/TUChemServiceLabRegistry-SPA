import {Component, OnInit, ViewChild, Output, Input, EventEmitter} from '@angular/core';

@Component({
  selector: 'app-select',
  templateUrl: './select.component.html',
  styleUrls: ['./select.component.css']
})
export class SelectComponent implements OnInit {
  showOptions: Boolean = false;
  @Input() data: {selectedValue: number, options: {value: number, label: string}[]};

  ngOnInit() {}
  openOptions(e: any) {
    this.showOptions ? this.showOptions = false : this.showOptions = true;
  }

  select(index: number) {
    this.data.selectedValue = index;
    this.showOptions = false;
  }
}
