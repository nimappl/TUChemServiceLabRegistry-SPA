import { Component, Input, OnInit } from '@angular/core';
import { CustomFieldData } from "../custom-field-data";
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from "@angular/forms";
import { DateConvertor } from './date-convertor';

@Component({
  selector: 'app-jalali-date-picker',
  templateUrl: './jalali-date-picker.component.html',
  styleUrls: ['./jalali-date-picker.component.css'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      multi: true,
      useExisting: JalaliDatePickerComponent
    },
  ]
})
export class JalaliDatePickerComponent implements OnInit, ControlValueAccessor {
  showCalendar: boolean = false;
  focusFlag: boolean = false;
  @Input() data: CustomFieldData;
  @Input() invalid: boolean;
  monthName = DateConvertor.monthName;
  dateList: {
    yearNumber: number,
    months: {
      monthNumber: number,
      days: {
        dayNumber: number,
        weekDay: number,
      }[]
    }[],
  }[] = [];
  pendingDate: {year: number, month: number, day: number};
  selectedDate: {year: number, month: number, day: number};
  selectedDateIsOnCalendar: boolean;
  weeks = [[], [], [], [], [], []];

  onChange = (selectedValue) => {};
  onTouched = () => {};
  touched = false;
  disabled = false;

  writeValue(value: any): void {
    this.initializeValue(value);
  }

  registerOnChange(onChange: any): void {
    this.onChange = onChange;
  }

  registerOnTouched(onTouched: any): void {
    this.onTouched = onTouched;
  }

  setDisabledState?(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }

  markAsTouched() {
    if (!this.touched) {
      this.onTouched();
      this.touched = true;
    }
  }

  ngOnInit() {
    this.initializeValue(this.data.selectedValue);

    let start: Date = new Date('2024-03-19');
    let untilYear = new Date().getFullYear() - 20;
    let jalaliList: {year: number, month: number, day: number, weekDay?: number}[] = [];
    let index = 0;

    while (start.getFullYear() >= untilYear) {
      let month = start.getMonth() < 9 ? `0${start.getMonth() + 1}` : start.getMonth() + 1,
          day = start.getDate() < 9 ? `0${start.getDate()}` : start.getDate();

      jalaliList.push(DateConvertor.georgianToJalali(`${start.getFullYear()}-${month}-${day}`));
      jalaliList[index].weekDay = this.weekDayConvert(start.getDay());
      start.setDate(start.getDate() - 1);
      index++;
    }

    let yearIndex = -1;
    for (let year = jalaliList[0].year; year >= 1381; year--) {
      let monthIndex = -1;
      yearIndex++;
      this.dateList.push({yearNumber: year, months: []});
      for (let month = 12; month > 0; month--) {
        monthIndex++;
        this.dateList[yearIndex].months.push({monthNumber: month, days: []});
        jalaliList.forEach(date => {
          if (date.year == year && date.month == month) {
            this.dateList[yearIndex].months[monthIndex].days.push({dayNumber: date.day, weekDay: date.weekDay});
          }
        });
      }
    }
  }

  initializeValue(value: string): void {
    if (value === "" || value === null || value === undefined) {
      this.data.selectedValue = null;
      let today = new Date(),
        month = today.getMonth() < 9 ? `0${today.getMonth() + 1}` : today.getMonth() + 1,
        day = today.getDate() < 9 ? `0${today.getDate()}` : today.getDate();
      this.pendingDate = DateConvertor.georgianToJalali(`${today.getFullYear()}-${month}-${day}`);
      this.selectedDate = null;
    } else {
      this.data.selectedValue = value;
      this.selectedDate = DateConvertor.georgianToJalali(value);
      this.pendingDate = DateConvertor.georgianToJalali(value);
    }
  }

  openOptions(e: any) {
    if (!this.disabled) {
      if (this.showCalendar) this.markAsTouched();
      if (!this.showCalendar) this.extractWeeks();
      this.showCalendar = !this.showCalendar;
    }
  }

  dateToString() {
    return `${this.selectedDate.year}/${this.selectedDate.month}/${this.selectedDate.day}`;
  }

  onSelectDay(day: number) {
    this.pendingDate.day = day;
    this.pendingDate.year = Number(this.pendingDate.year);
    this.pendingDate.month = Number(this.pendingDate.month);
    this.selectedDate = JSON.parse(JSON.stringify(this.pendingDate));
    this.data.selectedValue = DateConvertor.jalaliToGeorgian(this.pendingDate.year, this.pendingDate.month, this.pendingDate.day);
    this.showCalendar = false;
    this.onChange(this.data.selectedValue);
  }

  onSelectMonth() {
    this.pendingDate.day = 1;
    this.extractWeeks();
  }

  onSelectYear() {
    this.pendingDate.month = 1;
    this.pendingDate.day = 1;
    this.extractWeeks();
  }

  extractWeeks() {
    let week = 0;

    this.weeks = [[], [], [], [], [], []];
    this.dateList.forEach(date => {
      if (date.yearNumber == this.pendingDate.year) {
        date.months.forEach(month => {
          if (month.monthNumber == this.pendingDate.month) {
            if (this.selectedDate !== null) {
              if (this.selectedDate.year === date.yearNumber && this.selectedDate.month === month.monthNumber)
                this.selectedDateIsOnCalendar = true;
              else this.selectedDateIsOnCalendar = false;
            }
            for (let i = month.days.length; i > 0; i--) {
              this.weeks[week].push(month.days[i - 1].dayNumber);
              if (month.days[i - 1].weekDay === 6) week++;
            }
          }
        });
      }
    });

    while (this.weeks[0].length < 7) this.weeks[0].unshift(null);
  }

  weekDayConvert(gWeekDay: number) {
    switch (gWeekDay) {
      case 0: return 1;
      case 1: return 2;
      case 2: return 3;
      case 3: return 4;
      case 4: return 5;
      case 5: return 6;
      case 6: return 0;
    }
  }

  clicked() {
    setTimeout(() =>  this.focusFlag = true, 10 );
  }

  focusout() {
    this.focusFlag = false;
    setTimeout(() => {
      if (!this.focusFlag) {
        this.markAsTouched();
        this.showCalendar = false;
        this.focusFlag = false;
      }
    }, 50);
  }
}
