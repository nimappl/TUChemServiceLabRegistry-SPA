import { Component, Input, OnInit } from '@angular/core';
import { CustomFieldData } from "../custom-field-data";
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from "@angular/forms";

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
  monthName = ['فروردین', 'اردیبهشت', 'خرداد', 'تیر', 'مرداد', 'شهریور', 'مهر', 'آبان', 'آذر', 'دی', 'بهمن', 'اسفند'];
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
    this.data.selectedValue = value === "" ? null : value;
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
    let start: Date = new Date('2023-03-20');
    if (this.data.selectedValue !== null) {
      let selected = this.data.selectedValue;
      this.selectedDate = this.georgianToJalali(selected.getFullYear(), selected.getMonth() + 1, selected.getDate());
      this.pendingDate = this.georgianToJalali(selected.getFullYear(), selected.getMonth() + 1, selected.getDate());
    } else {
      let today = new Date();
      this.pendingDate = this.georgianToJalali(today.getFullYear(), today.getMonth() + 1, today.getDate());
      this.pendingDate.day = null;
      this.selectedDate = null;
    }

    let untilYear = new Date().getFullYear() - 20;
    let jalaliList: {year: number, month: number, day: number, weekDay: number}[] = [];
    let index = 0;

    while (start.getFullYear() >= untilYear) {
      jalaliList.push(this.georgianToJalali(start.getFullYear(), start.getMonth() + 1, start.getDate()));
      jalaliList[index].weekDay = this.weekDayConvert(start.getDay());
      index++;
      start.setDate(start.getDate() - 1);
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

    this.extractWeeks();
  }

  jalaliToGeorgian(jy:number, jm:number, jd:number): any {
    let sal_a, gy, gm, gd, days;
    jy += 1595;
    days = -355668 + (365 * jy) + (~~(jy / 33) * 8) + ~~(((jy % 33) + 3) / 4) + jd + ((jm < 7) ? (jm - 1) * 31 : ((jm - 7) * 30) + 186);
    gy = 400 * ~~(days / 146097);
    days %= 146097;
    if (days > 36524) {
      gy += 100 * ~~(--days / 36524);
      days %= 36524;
      if (days >= 365) days++;
    }
    gy += 4 * ~~(days / 1461);
    days %= 1461;
    if (days > 365) {
      gy += ~~((days - 1) / 365);
      days = (days - 1) % 365;
    }
    gd = days + 1;
    sal_a = [0, 31, ((gy % 4 === 0 && gy % 100 !== 0) || (gy % 400 === 0)) ? 29 : 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
    for (gm = 0; gm < 13 && gd > sal_a[gm]; gm++) gd -= sal_a[gm];

    let date = new Date();
    date.setDate(gd);
    date.setMonth(gm - 1);
    date.setFullYear(gy);
    return date;
  }

  georgianToJalali(gy:number, gm:number, gd:number):any {
    let g_d_m, jy, jm, jd, gy2, days;
    g_d_m = [0, 31, 59, 90, 120, 151, 181, 212, 243, 273, 304, 334];
    gy2 = (gm > 2) ? (gy + 1) : gy;
    days = 355666 + (365 * gy) + ~~((gy2 + 3) / 4) - ~~((gy2 + 99) / 100) + ~~((gy2 + 399) / 400) + gd + g_d_m[gm - 1];
    jy = -1595 + (33 * ~~(days / 12053));
    days %= 12053;
    jy += 4 * ~~(days / 1461);
    days %= 1461;
    if (days > 365) {
      jy += ~~((days - 1) / 365);
      days = (days - 1) % 365;
    }
    if (days < 186) {
      jm = 1 + ~~(days / 31);
      jd = 1 + (days % 31);
    } else {
      jm = 7 + ~~((days - 186) / 30);
      jd = 1 + ((days - 186) % 30);
    }

    return {year: jy, month: jm, day: jd};
  }

  openOptions(e: any) {
    this.markAsTouched();
    if (!this.disabled) {
      this.showCalendar ? this.showCalendar = false : this.showCalendar = true;
      this.extractWeeks();
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
    this.data.selectedValue = this.jalaliToGeorgian(this.pendingDate.year, this.pendingDate.month, this.pendingDate.day);
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

  select(index: number) {
    this.data.selectedValue = index;
    this.showCalendar = false;
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
        this.showCalendar = false;
        this.focusFlag = false;
      }
    }, 50);
  }
}
