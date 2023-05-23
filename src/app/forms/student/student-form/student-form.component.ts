import { Component, Inject, ViewChild } from '@angular/core';
import { CustomFieldData } from "../../../custom-fields/custom-field-data";
import { NgForm} from "@angular/forms";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { Data, EduField, Person, TUStudent } from "../../../model";
import { PersonService } from "../../../services/person.service";
import swal from "sweetalert";
import { StudentService } from "../../../services/student.service";
import { EduFieldService } from "../../../services/edu-field.service";

@Component({
  selector: 'app-student-form',
  templateUrl: './student-form.component.html',
  styleUrls: ['./student-form.component.css']
})
export class StudentFormComponent {
  mode: number; // 0: new, 1: edit
  title: string;
  reachingOut: boolean = false;
  submitted: boolean = false;
  genderOptions: CustomFieldData = new CustomFieldData();
  peopleOptions: CustomFieldData = new CustomFieldData();
  eduFieldOptions: CustomFieldData = new CustomFieldData();
  @ViewChild('f') form: NgForm;

  constructor(
    private dialogRef: MatDialogRef<StudentFormComponent>,
    @Inject(MAT_DIALOG_DATA) public data: TUStudent,
    private apiService: StudentService,
    private personApiService: PersonService,
    private eduFieldApiService: EduFieldService
  ) {}

  ngOnInit() {
    this.mode = (this.data.id == undefined) ? 0 : 1;
    this.title = (this.data.id == undefined) ? 'جدید' : 'ویرایش';

    this.genderOptions.label = 'جنسیت';
    this.genderOptions.options = [
      {value: 0, title: 'مرد'},
      {value: 1, title: 'زن'}
    ];

    this.getEduFieldOptions();
    this.getPeopleOptions();
    this.onPersonSelect();
    this.peopleOptions.label = 'شخص موجود در سیستم (کد ملی)';
    this.eduFieldOptions.label = 'رشته تحصیلی';
    // if (this.mode === 1) this.statusOptions.selectedValue = this.data.active ? 1 : 0;
  }

  getPeopleOptions(filter: string = '') {
    this.peopleOptions.options = [];
    let eduGroups: Data<Person> = new Data();
    eduGroups.pageSize = 100;
    eduGroups.filters = [{key: 'PNationalNumber', value: filter}];
    this.peopleOptions.loading = true;
    this.personApiService.get(eduGroups).subscribe(res => {
      this.peopleOptions.loading = false;
      eduGroups = res;
      res.records.forEach(item =>
        this.peopleOptions.options.push({value: item.id, title: `${item.firstName} ${item.lastName}`})
      );
      if (this.mode === 1) this.peopleOptions.selectedValue = this.data.id;
    }, err => {
      this.peopleOptions.loading = false;
      this.peopleOptions.loadingFailed = true;
    });
  }

  getEduFieldOptions(filter: string = '') {
    this.eduFieldOptions.options = [];
    let eduFields: Data<EduField> = new Data();
    eduFields.pageSize = 100;
    eduFields.filters = [{key: 'EduFieldName', value: filter}];
    this.eduFieldOptions.loading = true;
    this.eduFieldApiService.get(eduFields).subscribe(res => {
      this.eduFieldOptions.loading = false;
      eduFields = res;
      res.records.forEach(item =>
        this.eduFieldOptions.options.push({value: item.id, title: `${item.name}`})
      );
      if (this.mode === 1) this.eduFieldOptions.selectedValue = this.data.id;
    }, err => {
      this.eduFieldOptions.loading = false;
      this.eduFieldOptions.loadingFailed = true;
    });
  }

  onPersonSelect() {
    if (this.peopleOptions.selectedValue !== null) {
      this.personApiService.getById(this.peopleOptions.selectedValue).subscribe(res => {
        this.data.setPersonInfo(res);
      }, err => {
        swal({title: 'ناموفق', text: 'خطا در دریافت مشخصات شخص', icon: 'error'});
      });
    }
  }

  onEduFieldSelect() {
    if (this.eduFieldOptions.selectedValue !== null) {
      this.eduFieldApiService.getById(this.eduFieldOptions.selectedValue).subscribe(res => {
        this.data.eduField = res;
      }, err => {
        swal({title: 'ناموفق', text: 'خطا در دریافت مشخصات رشته', icon: 'error'});
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
        swal({title: 'موفق', text: `دانشجو جدید با موفقیت ثبت شد.`, icon: 'success'}).then(() => {
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
