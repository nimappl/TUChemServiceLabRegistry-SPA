import { Component, Inject, ViewChild } from '@angular/core';
import { CustomFieldData } from "../../../custom-fields/custom-field-data";
import { NgForm } from "@angular/forms";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { EduField, EduGroup, Data } from "../../../model";
import { EduFieldService } from "../../../services/edu-field.service";
import swal from "sweetalert";
import { EduGroupService } from "../../../services/edu-group.service";

@Component({
  selector: 'app-edu-field-form',
  templateUrl: './edu-field-form.component.html',
  styleUrls: ['./edu-field-form.component.css']
})
export class EduFieldFormComponent {
  mode: number; // 0: new, 1: edit
  title: string;
  reachingOut: boolean = false;
  submitted: boolean = false;
  groupOptions: CustomFieldData = new CustomFieldData();
  levelOptions: CustomFieldData = new CustomFieldData();
  @ViewChild('f') form: NgForm;

  constructor(
    private dialogRef: MatDialogRef<EduFieldFormComponent>,
    @Inject(MAT_DIALOG_DATA) public data: EduField,
    private apiService: EduFieldService,
    private eduGroupApi: EduGroupService
  ) {}

  ngOnInit() {
    this.mode = (this.data.id == undefined) ? 0 : 1;
    this.title = (this.data.id == undefined) ? 'جدید' : 'ویرایش';

    this.levelOptions.label = 'مقطع';
    this.levelOptions.options = [
      {value: 0, title: 'کاردانی'},
      {value: 1, title: 'کارشناسی'},
      {value: 2, title: 'کارشناسی ارشد'},
      {value: 3, title: 'دکتری'},
    ];

    this.groupOptions.label = 'گروه آموزشی';
    this.getEduGroupOptions();
  }

  getEduGroupOptions(titleFilter: string = '') {
    this.groupOptions.options = [];
    let eduGroups: Data<EduGroup> = new Data();
    eduGroups.pageSize = 100;
    eduGroups.filters = [{key: 'EduGroupName', value: titleFilter}];
    this.groupOptions.loading = true;
    this.eduGroupApi.get(eduGroups).subscribe(res => {
      this.groupOptions.loading = false;
      eduGroups = res;
      res.records.forEach(eg => this.groupOptions.options.push({value: eg.id, title: eg.name}));
      if (this.mode === 1) this.groupOptions.selectedValue = this.data.eduGroupId;
    }, err => {
      this.groupOptions.loading = false;
      this.groupOptions.loadingFailed = true;
    });
  }

  onSubmit() {
    this.data.name = this.form.value.name;
    this.data.fieldLevel = this.form.value.fieldLevel;
    this.data.eduGroupId = this.form.value.eduGroup;
    this.submit();
  }

  submit() {
    this.reachingOut = true;
    if (this.mode === 0) {
      this.apiService.create(this.data).subscribe(res => {
        this.reachingOut = false;
        this.submitted = true;
        swal({title: 'موفق', text: `رشته تحصیلی جدید با موفقیت ثبت شد.`, icon: 'success'}).then(() => {
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
