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

  constructor(
    private dialogRef: MatDialogRef<InstrumentFormComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Instrument,
    private apiService: InstrumentService
  ) {}

  ngOnInit() {
    this.mode = (this.data.id == undefined) ? 0 : 1;
    this.title = (this.data.id == undefined) ? 'جدید' : 'ویرایش';

    this.statusOptions.label = 'وضعیت سرویس دهی';
    this.statusOptions.options = [
        {value: 0, title: 'غیرقابل استفاده'},
        {value: 1, title: 'آماده سرویس'}
    ];
    // if (this.mode === 1) this.statusOptions.selectedValue = this.data.active ? 1 : 0;
  }

  onSubmit() {
    this.data.name = this.form.value.name;
    this.data.model = this.form.value.model;
    this.data.serial = this.form.value.serial;
    this.data.manufacturer = this.form.value.manufacturer;
    this.data.madeIn = this.form.value.madeIn;
    this.data.serviceable = this.form.value.serviceable;
    this.submit();
  }

  submit() {
    this.reachingOut = true;
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

