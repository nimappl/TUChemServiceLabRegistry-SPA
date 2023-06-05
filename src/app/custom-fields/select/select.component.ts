import {Component, ElementRef, EventEmitter, Input, Output} from '@angular/core';
import { CustomFieldData } from "../custom-field-data";
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from "@angular/forms";

@Component({
  selector: 'app-select',
  templateUrl: './select.component.html',
  styleUrls: ['./select.component.css'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      multi: true,
      useExisting: SelectComponent
    },
  ]
})
export class SelectComponent implements ControlValueAccessor {
  showOptions: Boolean = false;
  @Input() data: CustomFieldData = new CustomFieldData();
  @Input() invalid: boolean;
  @Output() onSelect = new EventEmitter();

  onChange = (selectedValue) => {};
  onTouched = () => {};
  touched = false;
  disabled = false;

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

  openOptions(e: any) {
    if (!this.disabled) {
      if (this.showOptions) this.markAsTouched();
      this.showOptions = !this.showOptions;
    }
  }

  select(index: number) {
    this.data.selectedValue = this.data.options[index].value;
    this.onChange(this.data.selectedValue);
    this.onSelect.emit(index);
    this.showOptions = false;
  }

  setTitleOfSelectedValue(title: any) {
    this.data.options.forEach(opt => {
      if (opt.value == this.data.selectedValue) {
        title.innerText = opt.title;
      }
    });
  }

  focusout() {
    this.showOptions = false;
    this.markAsTouched();
  }
}
