import {Component, Inject, ViewChild} from '@angular/core';
import {CustomFieldData} from "../../../custom-fields/custom-field-data";
import {NgForm} from "@angular/forms";
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {Data, EduGroup, Person, TUProfessor} from "../../../model";
import {ProfessorService} from "../../../services/professor.service";
import {PersonService} from "../../../services/person.service";
import {EduGroupService} from "../../../services/edu-group.service";
import swal from "sweetalert";

@Component({
  selector: 'app-professor-form',
  templateUrl: './professor-form.component.html',
  styleUrls: ['./professor-form.component.css']
})
export class ProfessorFormComponent {
  mode: number; // 0: new, 1: edit
  title: string;
  reachingOut: boolean = false;
  submitted: boolean = false;
  genderOptions: CustomFieldData = new CustomFieldData();
  peopleOptions: CustomFieldData = new CustomFieldData();
  eduGroupOptions: CustomFieldData = new CustomFieldData();
  @ViewChild('f') form: NgForm;

  constructor(
    private dialogRef: MatDialogRef<ProfessorFormComponent>,
    @Inject(MAT_DIALOG_DATA) public data: TUProfessor,
    private apiService: ProfessorService,
    private personApiService: PersonService,
    private eduGroupApiService: EduGroupService
  ) {}

  ngOnInit() {
    this.mode = (this.data.id == undefined) ? 0 : 1;
    this.title = (this.data.id == undefined) ? 'جدید' : 'ویرایش';

    this.genderOptions.label = 'جنسیت';
    this.genderOptions.options = [
      {value: 0, title: 'مرد'},
      {value: 1, title: 'زن'}
    ];

    this.getEduGroupOptions();
    this.getPeopleOptions();
    this.onPersonSelect();
    this.peopleOptions.label = 'شخص موجود در سیستم (کد ملی)';
    this.eduGroupOptions.label = 'گروه آموزشی';
    if (this.mode == 1) this.eduGroupOptions.selectedValue = this.data.eduGroupId;
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

  getEduGroupOptions(filter: string = '') {
    this.eduGroupOptions.options = [];
    let eduGroups: Data<EduGroup> = new Data();
    eduGroups.pageSize = 100;
    eduGroups.filters = [{key: 'EduGroupName', value: filter}];
    this.eduGroupOptions.loading = true;
    this.eduGroupApiService.get(eduGroups).subscribe(res => {
      this.eduGroupOptions.loading = false;
      eduGroups = res;
      res.records.forEach(item =>
        this.eduGroupOptions.options.push({value: item.id, title: `${item.name}`})
      );
      if (this.mode === 1) this.eduGroupOptions.selectedValue = this.data.id;
    }, err => {
      this.eduGroupOptions.loading = false;
      this.eduGroupOptions.loadingFailed = true;
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

  onEduGroupSelect() {
    if (this.eduGroupOptions.selectedValue !== null) {
      this.eduGroupApiService.getById(this.eduGroupOptions.selectedValue).subscribe(res => {
        this.data.eduGroup = res;
      }, err => {
        swal({title: 'ناموفق', text: 'خطا در دریافت مشخصات گروه آموزشی', icon: 'error'});
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
        swal({title: 'موفق', text: `هیأت عملی جدید با موفقیت ثبت شد.`, icon: 'success'}).then(() => {
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
