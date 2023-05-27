import { Component, Inject, ViewChild } from '@angular/core';
import { CustomFieldData } from "../../../custom-fields/custom-field-data";
import { NgForm } from "@angular/forms";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import {Data, EduGroup, LabPersonnel, Person, PersonGeneral} from "../../../model";
import swal from "sweetalert";
import { LabPersonnelService } from "../../../services/lab-personnel.service";
import {PersonService} from "../../../services/person.service";

@Component({
  selector: 'app-lab-personnel-form',
  templateUrl: './lab-personnel-form.component.html',
  styleUrls: ['./lab-personnel-form.component.css']
})
export class LabPersonnelFormComponent {
  mode: number; // 0: new, 1: edit
  title: string;
  reachingOut: boolean = false;
  submitted: boolean = false;
  genderOptions: CustomFieldData = new CustomFieldData();
  peopleOptions: CustomFieldData = new CustomFieldData();
  @ViewChild('f') form: NgForm;

  constructor(
    private dialogRef: MatDialogRef<LabPersonnelFormComponent>,
    @Inject(MAT_DIALOG_DATA) public data: LabPersonnel,
    private apiService: LabPersonnelService,
    private personApiService: PersonService
  ) {}

  ngOnInit() {
    this.mode = (this.data.id == undefined) ? 0 : 1;
    this.title = (this.data.id == undefined) ? 'جدید' : 'ویرایش';

    this.genderOptions.label = 'جنسیت';
    this.genderOptions.options = [
      {value: 0, title: 'مرد'},
      {value: 1, title: 'زن'}
    ];

    this.getPeopleOptions();
    this.onPersonSelect();
    this.peopleOptions.label = 'شخص موجود در سیستم';
    // if (this.mode === 1) this.statusOptions.selectedValue = this.data.active ? 1 : 0;
  }

  getPeopleOptions(filter: string = '') {
    this.peopleOptions.options = [];
    let person: Data<PersonGeneral> = new Data();
    person.pageSize = 100;
    person.filters = [{key: 'PNationalNumber', value: filter}];
    this.peopleOptions.loading = true;
    this.personApiService.get(person).subscribe(res => {
      this.peopleOptions.loading = false;
      person = res;
      res.records.forEach(eg =>
        this.peopleOptions.options.push({value: eg.id, title: `${eg.firstName} ${eg.lastName}`})
      );
      if (this.mode === 1) this.peopleOptions.selectedValue = this.data.id;
    }, err => {
      this.peopleOptions.loading = false;
      this.peopleOptions.loadingFailed = true;
    });
  }

  onPersonSelect() {
    console.log(this.data)
    if (this.peopleOptions.selectedValue !== null) {
      this.personApiService.getById(this.peopleOptions.selectedValue).subscribe(res => {
        this.data.setPersonInfo(res);
        console.log(this.data)
      }, err => {
        swal({title: 'ناموفق', text: 'خطا در دریافت مشخصات شخص', icon: 'error'});
      });
    }
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
        swal({title: 'موفق', text: `پرسنل جدید با موفقیت ثبت شد.`, icon: 'success'}).then(() => {
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
