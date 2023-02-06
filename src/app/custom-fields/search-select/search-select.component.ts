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
  @Output() onSearch: EventEmitter<string> = new EventEmitter();
  @Output() onSelectionChange: EventEmitter<any> = new EventEmitter();
  searchText: string = '';
  inputId = Math.floor(Math.random() * 100);

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
    if (value === null || value === undefined || value === "") {
      this.data.selectedValue = null;
    } else {
      this.data.selectedValue = value;
    }
  }

  markAsTouched() {
    if (!this.touched) {
      this.onTouched();
      this.touched = true;
    }
  }

  select(value: number) {
    this.data.selectedValue = value;
    this.onSelectionChange.emit();
    this.showOptions = false;
    this.changeFormStatus(2);
    this.onChange(this.data.selectedValue);
  }

  setTitleOfSelectedValue() {
    this.data.options.forEach(opt => {
      if (opt.value === this.data.selectedValue)
        this.searchText = opt.title;
    });
  }

  onInteract() {
    if (!this.disabled) {
      this.data.selectedValue = null;
      if (this.searchText === '') this.changeFormStatus(0);
      else this.changeFormStatus(1);
      this.onSearch.emit(this.searchText);
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
    this.showOptions = true;
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
