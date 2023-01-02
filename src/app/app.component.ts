import {Component, ElementRef, OnInit, ViewChild,} from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: 'app-component.html',
  styleUrls: [
      'app-component.css'
  ]
})
export class AppComponent implements OnInit {
  @ViewChild('text') txtField: ElementRef;
  @ViewChild('fieldStatus') fieldStatus: ElementRef;
  @ViewChild('select') selectField: ElementRef;
  data: any;
  constructor() {
  this.data = {
    selectedValue: null,
    options: [
      {value: 0, label: 'گزینه ۱'},
      {value: 1, label: 'گزینه ۲'},
      {value: 2, label: 'گزینه ۳'},
      {value: 3, label: 'گزینه ۴'},
      {value: 4, label: 'گزینه ۵'},
      {value: 5, label: 'گزینه ۶'}
    ]
  }
}
  fillState: Number = 0;
  validState: Number = 0;
  status: Number = 0;
  selectedValueText: string;

  ngOnInit() {
  }

  toggleContent() {
    if (this.fillState == 0) {
      this.txtField.nativeElement.value = 'نام کاربری';
      this.fillState = 1;
    } else {
      this.txtField.nativeElement.value = '';
      this.fillState = 0;
    }
  }
  changeStatus() {
    if (this.status == 0) {
      this.fieldStatus.nativeElement.classList.add('status-invalid');
      this.status = 1;
    } else if (this.status == 1) {
      this.fieldStatus.nativeElement.classList.remove('status-invalid');
      this.fieldStatus.nativeElement.classList.add('status-valid');
      this.status = 2;
    } else if (this.status == 2) {
      this.fieldStatus.nativeElement.classList.remove('status-valid');
      this.status = 0;
    }
  }

  changeValidity() {
    if (this.validState == 0) {
      this.txtField.nativeElement.classList.add('invalid');
      this.validState = 1;
    } else {
      this.txtField.nativeElement.classList.remove('invalid');
      this.validState = 0;
    }
  }

  showDate() {
    console.log(new Date())
  }
}
