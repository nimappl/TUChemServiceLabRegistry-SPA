import {Component, Inject, ViewChild} from '@angular/core';
import {NgForm} from "@angular/forms";
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {IMUsedMaterial} from "../../../model";
import {UsedMaterialService} from "../../../services/used-material.service";
import swal from "sweetalert";
import {CustomFieldData} from "../../../custom-fields/custom-field-data";

@Component({
  selector: 'app-used-material-form',
  templateUrl: './used-material-form.component.html',
  styleUrls: ['./used-material-form.component.css']
})
export class UsedMaterialFormComponent {
  mode: number; // 0: new, 1: edit
  title: string;
  reachingOut: boolean = false;
  submitted: boolean = false;
  typeOptions: CustomFieldData = new CustomFieldData();
  @ViewChild('f') form: NgForm;

  constructor(
    private dialogRef: MatDialogRef<UsedMaterialFormComponent>,
    @Inject(MAT_DIALOG_DATA) public data: IMUsedMaterial,
    private apiService: UsedMaterialService
  ) {}

  ngOnInit() {
    this.mode = (this.data.id == undefined) ? 0 : 1;
    this.title = (this.data.id == undefined) ? 'جدید' : 'ویرایش';
    this.typeOptions.label = 'نوع';
    this.typeOptions.options = [
      {value: 0, title: 'قطعه'},
      {value: 1, title: 'مایع'},
      {value: 2, title: 'گاز'}
    ];
  }

  onSubmit() {
    this.submit();
  }

  submit() {
    this.reachingOut = true;
    if (this.mode === 0) {
      this.apiService.create(this.data).subscribe(res => {
        this.reachingOut = false;
        this.submitted = true;
        swal({title: 'موفق', text: `مواد/قطعه جدید با موفقیت ثبت شد.`, icon: 'success'}).then(() => {
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
