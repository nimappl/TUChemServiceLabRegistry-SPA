import {Component, ElementRef, EventEmitter, Input, Output, ViewChild} from '@angular/core';

@Component({
  selector: 'app-search-select',
  templateUrl: './search-select.component.html',
  styleUrls: ['./search-select.component.css']
})
export class SearchSelectComponent {
  showOptions: boolean = false;
  focusFlag: boolean = false;
  @ViewChild('formStatus') formStatus: ElementRef;
  @ViewChild('searchField') searchField: ElementRef;
  @Input() name: string;
  @Input() label: string;
  @Input() data: {selectedValue: number, options: {value: number, label: string}[]};
  @Input() invalid: boolean = false;
  searchText: string = '';

  select(index: number) {
    this.data.selectedValue = index;
    this.showOptions = false;
    this.searchText = this.data.options[this.data.selectedValue].label;
    this.changeFormStatus(2);
  }

  onInteract() {
    this.showOptions = this.searchText != '';
    if (this.data.selectedValue == null && this.searchText !== '') this.changeFormStatus(1);
    else if (this.data.selectedValue !== null && this.searchText !== this.data.options[this.data.selectedValue].label) {
      this.data.selectedValue = null;
      this.changeFormStatus(1);
    } else if (this.searchText === '') this.changeFormStatus(0);
  }

  changeFormStatus(status: number /* 0 none, 1 invalid, 2 valid */) {
    let statusMarkClass = this.formStatus.nativeElement.classList;
    statusMarkClass.remove('status-invalid');
    statusMarkClass.remove('status-valid');
    if (status == 1) statusMarkClass.add('status-invalid');
    else if (status == 2) statusMarkClass.add('status-valid');
  }

  focusout() {
    this.focusFlag = false;
    setTimeout(() => {
      if (!this.focusFlag) {
        this.showOptions = false;
        this.focusFlag = false;
      }
    }, 50);
  }

  clicked() {
    setTimeout(() =>  this.focusFlag = true, 10 );
  }
}
