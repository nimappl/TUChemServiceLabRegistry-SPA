import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { NgForm } from "@angular/forms";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { EduGroup } from "../../../model";
import { EduGroupService } from "../../../services/edu-group.service";
import swal from "sweetalert";

@Component({
  selector: 'app-edu-group-form',
  templateUrl: './edu-group-form.component.html',
  styleUrls: ['./edu-group-form.component.css']
})
export class EduGroupFormComponent {
  mode: number; // 0: new, 1: edit
  title: string;
  reachingOut: boolean = false;
  submitted: boolean = false;
  @ViewChild('f') form: NgForm;

  constructor(
    private dialogRef: MatDialogRef<EduGroupFormComponent>,
    @Inject(MAT_DIALOG_DATA) public data: EduGroup,
    private apiService: EduGroupService
  ) {}

  ngOnInit() {
    this.mode = (this.data.id == undefined) ? 0 : 1;
    this.title = (this.data.id == undefined) ? 'جدید' : 'ویرایش';
  }

  onSubmit() {
    if (this.form.valid) this.submit();
  }

  submit() {
    this.reachingOut = true;
    if (this.mode === 0) {
      this.apiService.create(this.data).subscribe(res => {
        this.reachingOut = false;
        this.submitted = true;
        swal({title: 'موفق', text: `گروه آموزشی جدید با موفقیت ثبت شد.`, icon: 'success'}).then(() => {
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
