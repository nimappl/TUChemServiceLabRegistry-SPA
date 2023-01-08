import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import swal from "sweetalert";
import { InstrumentService } from "../../../services/instrument.service";
import { Instrument } from "../../../model";

@Component({
  selector: 'app-instrument-form',
  templateUrl: './instrument-form.component.html',
  styleUrls: ['./instrument-form.component.css']
})
export class InstrumentFormComponent {
  mode: number; // 0: new, 1: edit
  title: string;
  reachingOut: boolean = false;
  submitted: boolean = false;
  slctOptions = {selectedValue: null, options: []};

  constructor(
    private dialogRef: MatDialogRef<InstrumentFormComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Instrument,
    private apiService: InstrumentService
  ) {}

  ngOnInit() {
    this.mode = (this.data.instrumentId == undefined) ? 0 : 1;
    this.title = (this.data.instrumentId == undefined) ? 'دستگاه جدید' : 'ویرایش';
    for(let i = 30; i < 50; i++) {
      this.slctOptions.options.push({value: i, label: `گزینهههههههههههههههههههههههههههههههههههههههههههههههههههههههههههههههههههههههههههههههههههههههههههههههههههههه ${i}`});
    }
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

