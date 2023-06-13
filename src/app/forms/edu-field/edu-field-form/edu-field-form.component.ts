import { Component, Inject, ViewChild } from '@angular/core';
import { CustomFieldData } from "../../../custom-fields/custom-field-data";
import { NgForm } from "@angular/forms";
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef} from "@angular/material/dialog";
import { EduField, EduGroup, Data } from "../../../model";
import { EduFieldService } from "../../../services/edu-field.service";
import swal from "sweetalert";
import { EduGroupService } from "../../../services/edu-group.service";
import {EduGroupFormComponent} from "../../edu-group/edu-group-form/edu-group-form.component";

@Component({
  selector: 'app-edu-field-form',
  templateUrl: './edu-field-form.component.html',
  styleUrls: ['./edu-field-form.component.css']
})
export class EduFieldFormComponent {
  mode: number; // 0: new, 1: edit
  title: string;
  reachingOut: boolean = false;
  groupOptions: CustomFieldData = new CustomFieldData();
  @ViewChild('f') form: NgForm;

  constructor(
    private dialogRef: MatDialogRef<EduFieldFormComponent>,
    @Inject(MAT_DIALOG_DATA) public data: EduField,
    private apiService: EduFieldService,
    private eduGroupApi: EduGroupService,
    private eduGroupDialog: MatDialog
  ) {}

  ngOnInit() {
    this.mode = (this.data.id == undefined) ? 0 : 1;
    this.title = (this.data.id == undefined) ? 'جدید' : 'ویرایش';

    this.groupOptions.label = 'گروه آموزشی';
    this.getEduGroupOptions();
  }

  getEduGroupOptions() {
    let eduGroups: Data<EduGroup> = new Data();
    eduGroups.pageSize = null;
    this.groupOptions.loading = true;
    this.eduGroupApi.get(eduGroups).subscribe(res => {
      this.groupOptions.loading = false;
      eduGroups = res;
      res.records.forEach(group => this.groupOptions.options.push({value: group.id, title: group.name, data: group}));
      if (this.mode === 1 && this.groupOptions.selectedValue) {
        let selectedGroupIsInList = false;
        res.records.forEach(group => {
          if (this.groupOptions.selectedValue === group.id) selectedGroupIsInList = true;
        });
        if (!selectedGroupIsInList) {
          this.groupOptions.options.push({value: this.data.eduGroup.id, title: this.data.eduGroup.name, data: this.data.eduGroup});
        }
      }
    }, err => {
      this.groupOptions.loading = false;
      this.groupOptions.loadingFailed = true;
    });
  }

  openEduGroupForm() {
    let data: EduGroup = new EduGroup();

    const dialogRef = this.eduGroupDialog.open(EduGroupFormComponent, {
      width: '650px',
      direction: 'rtl',
      disableClose: true,
      data: data
    });

    dialogRef.afterClosed().subscribe(eg => {
      if(eg) {
        this.groupOptions.options.push({value: eg.id, title: eg.name, data: eg});
        this.data.eduGroupId = eg.id;
        this.data.eduGroup = eg;
      }
    });
  }

  onSubmit() {
    if (this.form.valid) {
      this.groupOptions.options.forEach(eg => {
        if (eg.value === this.data.eduGroupId) this.data.eduGroup = eg.data;
      });
      this.submit();
    }
  }

  submit() {
    this.reachingOut = true;
    if (this.mode === 0) {
      this.apiService.create(this.data).subscribe(res => {
        this.reachingOut = false;
        this.data.id = res;
        swal({title: 'موفق', text: `رشته تحصیلی جدید با موفقیت ثبت شد.`, icon: 'success'}).then(() => {
          this.dialogRef.close(this.data);
        });
      }, err => {
        this.reachingOut = false;
        swal({title: 'ناموفق', icon: 'error'});
      });
    } else {
      this.apiService.update(this.data).subscribe(res => {
        this.reachingOut = false;
        swal({title: 'موفق', text: `عملیات بروزرسانی با موفقیت انجام شد.`, icon: 'success'}).then(() => {
          this.dialogRef.close(null);
        });
      }, err => {
        this.reachingOut = false;
        swal({title: 'ناموفق', icon: 'error'});
      });
    }
  }
}
