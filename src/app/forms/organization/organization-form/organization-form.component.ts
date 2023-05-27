import {Component, Inject, ViewChild} from '@angular/core';
import {CustomFieldData} from "../../../custom-fields/custom-field-data";
import {NgForm} from "@angular/forms";
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {Data, Organization, OrgPhoneNumber, OrgRepresentative, Person} from "../../../model";
import {OrganizationService} from "../../../services/organization.service";
import swal from "sweetalert";
import {TableConfig} from "../../../data-table/table-config";
import {PersonService} from "../../../services/person.service";

@Component({
  selector: 'app-organization-form',
  templateUrl: './organization-form.component.html',
  styleUrls: ['./organization-form.component.css']
})
export class OrganizationFormComponent {
  mode: number; // 0: new, 1: edit
  title: string;
  reachingOut: boolean = false;
  submitted: boolean = false;
  @ViewChild('f') form: NgForm;
  selectPersonData: CustomFieldData = new CustomFieldData();
  genderOptions: CustomFieldData = new CustomFieldData();
  representativesTableConfig: TableConfig = new TableConfig(0);
  representativesData: Data<Person> = new Data<Person>();
  pendingRepresentative: Person = new Person();
  repSelectedFromDb: boolean = false;
  showRepresentativeForm: boolean = false;

  constructor(
    private dialogRef: MatDialogRef<OrganizationFormComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Organization,
    private apiService: OrganizationService,
    private personService: PersonService
  ) {}

  ngOnInit() {
    this.mode = (this.data.id == undefined) ? 0 : 1;
    this.title = (this.data.id == undefined) ? 'جدید' : 'ویرایش';
    if (!this.data.phoneNumbers) this.data.phoneNumbers = [];
    if (!this.data.representatives) this.data.representatives = [];
    this.representativesData.records = this.data.representatives;
    this.representativesTableConfig.hasDelete = true;
    this.representativesTableConfig.columns = [
      {for: 'nationalNumber', dbName: 'PNationalNumber', title: 'کد ملی', sortable: false, hasSearch: false},
      {for: 'firstName', dbName: 'PFirstName', title: 'نام', sortable: false, hasSearch: false},
      {for: 'lastName', dbName: 'PLastName', title: 'نام خانوادگی', sortable: false, hasSearch: false},
      {for: 'phoneNumber', dbName: 'PPhoneNumber', title: 'تلفن تماس', sortable: false, hasSearch: false}
    ];
    this.selectPersonData.label = 'نام';
    this.genderOptions.label = 'جنسیت';
    this.genderOptions.options = [
      {value: 0, title: 'مرد'},
      {value: 1, title: 'زن'}
    ];
  }

  onSearchPerson() {
    if (this.pendingRepresentative.firstName !== '') {
      this.selectPersonData.loading = true;
      this.personService.queryByFullName(this.pendingRepresentative.firstName).subscribe(res => {
        this.selectPersonData.loading = false;
        this.selectPersonData.options = [];
        res.forEach(item =>
          this.selectPersonData.options.push({value: item.id, title: `${item.firstName} ${item.lastName}`, fieldValue: item.firstName})
        );
      }, err => {
        this.selectPersonData.loading = false;
        this.selectPersonData.loadingFailed = true;
      });
    }
  }

  onSelectPerson() {
    this.personService.getById(this.selectPersonData.selectedValue).subscribe(res => {
      this.pendingRepresentative = res;
      this.repSelectedFromDb = true;
    });
  }

  onAddNumber() {
    this.data.phoneNumbers.push(new OrgPhoneNumber());
  }

  onRemoveNumber(index: number) {
    this.data.phoneNumbers.splice(index, 1);
  }

  onAddRepresentative() {
    this.pendingRepresentative.typeOrg = true;
    this.data.representatives.push(<OrgRepresentative>this.pendingRepresentative);
    this.clearPersonForm();
    this.showRepresentativeForm = false;
  }

  onRemoveRepresentative(index: number) {
    this.representativesData.records.splice(index, 1);
  }

  clearPersonForm() {
    this.pendingRepresentative = new Person();
    this.repSelectedFromDb = false;
    this.selectPersonData.selectedValue = null;
    this.selectPersonData.searchText = '';
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
        swal({title: 'موفق', text: `سازمان/شرکت جدید با موفقیت ثبت شد.`, icon: 'success'}).then(() => {
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
