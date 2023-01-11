import {Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';
import {CustomFieldData} from "../custom-field-data";
import {ControlValueAccessor, NG_VALUE_ACCESSOR} from "@angular/forms";

@Component({
  selector: 'app-search-select',
  templateUrl: './search-select.component.html',
  styleUrls: ['./search-select.component.css'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      multi: true,
      useExisting: SearchSelectComponent
    }
  ]
})
export class SearchSelectComponent implements ControlValueAccessor, OnInit {
  showOptions: boolean = false;
  focusFlag: boolean = false;
  @ViewChild('formStatus') formStatus: ElementRef;
  @ViewChild('searchField') searchField: ElementRef;
  @Input() data: CustomFieldData;
  searchText: string = '';

  onChange = (selectedValue) => {};
  onTouched = () => {};
  touched = false;
  disabled = false;
  loading = false;
  loadingFailed = false;

  ngOnInit() {
    if (this.data.selectedValue !== null) this.searchText = this.data.options[this.data.selectedValue].title;
  }

  registerOnChange(onChange: any): void {
    this.onChange = onChange;
  }

  registerOnTouched(onTouched: any): void {
    this.onTouched = onTouched;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }

  writeValue(value: any): void {
    this.data.selectedValue = value === "" ? null : value;
  }

  markAsTouched() {
    if (!this.touched) {
      this.onTouched();
      this.touched = true;
    }
  }

  select(value: number) {
    this.data.selectedValue = value;
    this.showOptions = false;
    this.searchText = this.data.options[this.data.selectedValue].title;
    this.changeFormStatus(2);
    this.onChange(this.data.selectedValue);
  }

  onInteract() {
    if (!this.disabled) {
      this.markAsTouched();
      this.showOptions = this.searchText !== '';
      if (this.data.selectedValue == null && this.searchText !== '') this.changeFormStatus(1);
      else if (this.data.selectedValue !== null && this.searchText !== this.data.options[this.data.selectedValue].title) {
        this.data.selectedValue = null;
        this.onChange(this.data.selectedValue);
        this.changeFormStatus(1);
      } else if (this.searchText === '') this.changeFormStatus(0);
    }
  }

  changeFormStatus(status: number /* 0 none, 1 invalid, 2 valid */) {
    let statusMarkClass = this.formStatus.nativeElement.classList;
    statusMarkClass.remove('status-invalid');
    statusMarkClass.remove('status-valid');
    if (status == 1) statusMarkClass.add('status-invalid');
    else if (status == 2) statusMarkClass.add('status-valid');
  }

  clicked() {
    setTimeout(() =>  this.focusFlag = true, 10 );
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
}
