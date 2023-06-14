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
  @Input() data: CustomFieldData;
  @Input() invalid: boolean;
  @Input() hasDropSelectionBtn: boolean = true;
  @Input() maxLength: number = 150;
  @Input() valueId: boolean = false;
  @Output() onSelectionChange: EventEmitter<any> = new EventEmitter();
  @Output() onSearch: EventEmitter<any> = new EventEmitter<any>();
  @Output() onDropSelected: EventEmitter<any> = new EventEmitter<any>();
  inputId = Math.floor(Math.random() * 100);

  onChange = (selectedValue) => {};
  onTouched = () => {};
  touched = false;
  disabled = false;
  loading = false;
  loadingFailed = false;

  ngOnInit() {}

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
      this.data.selectedValue = null;
    } else {
      if (!this.valueId) this.data.searchText = value;
      this.data.selectedValue = value;
    }
  }

  markAsTouched() {
    if (!this.touched) {
      this.onTouched();
      this.touched = true;
    }
  }

  select(index: number, value: number, fieldValue: string) {
    this.data.selectedValue = value;
    this.data.searchText = fieldValue;
    if (this.valueId) {
      this.onChange(this.data.selectedValue);
    }
    this.onSelectionChange.emit(index);
    this.showOptions = false;
  }

  onInteract() {
    if (!this.disabled) {
      this.openOptions();
      if (!this.valueId) this.onChange(this.data.searchText);
      this.onSearch.emit();
    }
  }

  dropSelected() {
    this.onDropSelected.emit();
    this.data.selectedValue = null;
    if (this.valueId) this.onChange(null);
  }

  clicked() {
    if (!this.disabled) this.openOptions();
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
        this.markAsTouched();
      }
    }, 30);
  }
}
