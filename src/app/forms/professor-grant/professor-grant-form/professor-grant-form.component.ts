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
  selector: 'app-professor-grant-form',
  templateUrl: './professor-grant-form.component.html',
  styleUrls: ['./professor-grant-form.component.css']
})
export class ProfessorGrantFormComponent {
  mode: number; // 0: new, 1: edit
  title: string;
  reachingOut: boolean = false;
  submitted: boolean = false;
  issueDateField: CustomFieldData = new CustomFieldData();
  expiryDateField: CustomFieldData = new CustomFieldData();
  peopleOptions: CustomFieldData = new CustomFieldData();
  @ViewChild('f') form: NgForm;

  constructor(
    private dialogRef: MatDialogRef<ProfessorGrantFormComponent>,
    @Inject(MAT_DIALOG_DATA) public data: TUProfessor,
    private apiService: ProfessorService,
    private personApiService: PersonService,
  ) {}

  ngOnInit() {
    this.mode = (this.data.id == undefined) ? 0 : 1;
    this.title = (this.data.id == undefined) ? 'جدید' : 'ویرایش';

    this.getPeopleOptions();
    this.onPersonSelect();
    this.peopleOptions.label = 'هیأت علمی (کد ملی)'
    this.issueDateField.label = 'تاریخ تخصیص';
    this.expiryDateField.label = 'تاریخ انقضا';
  }

  getPeopleOptions(filter: string = '') {
    this.peopleOptions.options = [];
    let professors: Data<TUProfessor> = new Data();
    professors.pageSize = 100;
    professors.filters = [{key: 'PNationalNumber', value: filter}];
    this.peopleOptions.loading = true;
    this.apiService.get(professors).subscribe(res => {
      this.peopleOptions.loading = false;
      professors = res;
      res.records.forEach(item =>
        this.peopleOptions.options.push({value: item.id, title: `${item.firstName} ${item.lastName}`})
      );
      if (this.mode === 1) this.peopleOptions.selectedValue = this.data.id;
    }, err => {
      this.peopleOptions.loading = false;
      this.peopleOptions.loadingFailed = true;
    });
  }

  onPersonSelect() {
    if (this.peopleOptions.selectedValue !== null) {
      this.apiService.getById(this.peopleOptions.selectedValue).subscribe(res => {
        this.data = res;
      }, err => {
        swal({title: 'ناموفق', text: 'خطا در دریافت مشخصات شخص', icon: 'error'});
      });
    }
  }

  onSubmit() {
    // console.log(this.data);
    this.submit();
  }

  submit() {
    this.reachingOut = true;
    this.apiService.update(this.data).subscribe(res => {
      this.reachingOut = false;
      this.submitted = true;
      swal({title: 'موفق', text: `اطلاعات گرنت با موفقیت ثبت شد.`, icon: 'success'}).then(() => {
        this.dialogRef.close(this.submitted)
      });
    }, err => {
      this.reachingOut = false;
      swal({title: 'ناموفق', icon: 'error'});
    });
  }
}
