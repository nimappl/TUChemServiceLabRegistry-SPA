import {Component, Inject, OnInit, ViewChild} from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import swal from "sweetalert";
import { InstrumentService } from "../../../services/instrument.service";
import { Instrument } from "../../../model";
import {CustomFieldData} from "../../../custom-fields/custom-field-data";
import {NgForm} from "@angular/forms";

@Component({
  selector: 'app-instrument-form',
  templateUrl: './instrument-form.component.html',
  styleUrls: ['./instrument-form.component.css']
})
export class InstrumentFormComponent implements OnInit{
  mode: number; // 0: new, 1: edit
  title: string;
  reachingOut: boolean = false;
  submitted: boolean = false;
  statusOptions: CustomFieldData = new CustomFieldData();
  @ViewChild('f') form: NgForm;
  date: Date;

  constructor(
    private dialogRef: MatDialogRef<InstrumentFormComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Instrument,
    private apiService: InstrumentService
  ) {}

  ngOnInit() {
    this.mode = (this.data.instrumentId == undefined) ? 0 : 1;
    this.title = (this.data.instrumentId == undefined) ? 'دستگاه جدید' : 'ویرایش';

    this.statusOptions.label = 'تاریخ کیری';
    this.statusOptions.options = [
        {value: 0, title: 'غیرقابل استفاده'},
        {value: 1, title: 'آماده سرویس'}
    ];
    // if (this.mode === 1) this.statusOptions.selectedValue = this.data.active ? 1 : 0;
    // this.statusOptions.selectedValue = new Date('2015-06-16');
  }

  onSubmit(form: NgForm) {
    console.log(form);
  }

  submit() {
    this.reachingOut = true;
    this.data.active = this.statusOptions.selectedValue !== 0;
    if (this.mode === 0) {
      this.apiService.create(this.data).subscribe(res => {
        this.reachingOut = false;
        this.submitted = true;
        swal({title: 'موفق', text: `دستگاه جدید با موفقیت ثبت شد.`, icon: 'success'}).then(() => {
          this.dialogRef.close(this.submitted)
        });
      }, err => {
        this.reachingOut = false;
        swal({title: 'ناموفق', icon: 'error'});
      });
    } else {
      this.apiService.update(this.data).subscribe(res => {
        this.reachingOut = false;
        this.submitted = true;
        swal({title: 'موفق', text: `عملیات بروزرسانی با موفقیت انجام شد.`, icon: 'success'}).then(() => {
          this.dialogRef.close(this.submitted)
        });
      }, err => {
        this.reachingOut = false;
        swal({title: 'ناموفق', icon: 'error'});
      });
    }
  }
}

