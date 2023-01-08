import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-select',
  templateUrl: './select.component.html',
  styleUrls: ['./select.component.css']
})
export class SelectComponent {
  showOptions: Boolean = false;
  @Input() options: {selectedValue: number, options: {value: number, label: string}[]};
  @Input() label: string;
  @Input() name: string;
  @Input() invalid: boolean = false;

  openOptions(e: any) {
    this.showOptions ? this.showOptions = false : this.showOptions = true;
  }

  select(index: number) {
    this.options.selectedValue = index;
    this.showOptions = false;
  }

  focusout() {
    this.showOptions = false;
  }
}
