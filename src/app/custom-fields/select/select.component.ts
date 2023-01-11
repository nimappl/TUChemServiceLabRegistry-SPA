import { Component, Input } from '@angular/core';
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
    this.data.selectedValue = value === "" ? null : value;
  }

  markAsTouched() {
    if (!this.touched) {
      this.onTouched();
      this.touched = true;
    }
  }

  openOptions(e: any) {
    if (!this.disabled) {
      this.markAsTouched();
      this.showOptions ? this.showOptions = false : this.showOptions = true;
    }
  }

  select(value: number) {
    this.data.selectedValue = value;
    this.onChange(this.data.selectedValue);
    this.showOptions = false;
  }

  focusout() {
    this.showOptions = false;
  }
}
