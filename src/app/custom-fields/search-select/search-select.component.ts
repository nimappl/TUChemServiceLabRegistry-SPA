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
  @Output() onSelectionChange: EventEmitter<any> = new EventEmitter();
  @Output() onSearch: EventEmitter<any> = new EventEmitter<any>();
  inputId = Math.floor(Math.random() * 100);

  onChange = (selectedValue) => {};
  onTouched = () => {};
  touched = false;
  disabled = false;
  loading = false;
  loadingFailed = false;

  ngOnInit() {
    // if (this.data.selectedValue !== null) this.data.searchText = this.data.options[this.data.selectedValue].title;
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
    if (value === null || value === undefined || value === "") {
      this.data.searchText = null;
    } else {
      this.data.searchText = value;
    }
  }

  markAsTouched() {
    if (!this.touched) {
      this.onTouched();
      this.touched = true;
    }
  }

  select(value: number, fieldValue: string) {
    this.data.selectedValue = value;
    this.data.searchText = fieldValue;
    this.onSelectionChange.emit();
    this.showOptions = false;
    this.changeFormStatus(2);
  }

  onInteract() {
    if (!this.disabled) {
      this.data.selectedValue = null;
      this.openOptions();
      if (this.data.searchText === '') this.changeFormStatus(0);
      else this.changeFormStatus(1);
      this.onChange(this.data.searchText);
      this.onSearch.emit();
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
    this.markAsTouched();
    this.openOptions();
  }

  openOptions() {
    if (this.data.searchText && this.data.searchText.length > 0) {
      this.showOptions = true;
      setTimeout(() =>  this.focusFlag = true, 10 );
    } else {
      this.showOptions = false;
    }
  }

  focusout() {
    this.focusFlag = false;
    setTimeout(() => {
      if (!this.focusFlag) {
        this.showOptions = false;
        this.focusFlag = false;
      }
    }, 30);
  }
}
