import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { NgForm } from "@angular/forms";
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef} from "@angular/material/dialog";
import swal from "sweetalert";
import { PersonService } from "../../../services/person.service";
import {Data, EduField, EduGroup, Filter, Organization, PersonGeneral} from "../../../model";
import {CustomFieldData} from "../../../custom-fields/custom-field-data";
import {TableConfig} from "../../../data-table/table-config";
import {EduGroupService} from "../../../services/edu-group.service";
import {OrganizationService} from "../../../services/organization.service";
import {EduFieldService} from "../../../services/edu-field.service";
import {EduGroupFormComponent} from "../../edu-group/edu-group-form/edu-group-form.component";
import {EduFieldFormComponent} from "../../edu-field/edu-field-form/edu-field-form.component";

@Component({
  selector: 'app-person-form',
  templateUrl: './person-form.component.html',
  styleUrls: ['./person-form.component.css']
})
export class PersonFormComponent implements OnInit {
  mode: number; // 0: new, 1: edit
  title: string;
  reachingOut: boolean = false;
  submitted: boolean = false;
  genderOptions: CustomFieldData = new CustomFieldData();
  eduFieldOptions: CustomFieldData = new CustomFieldData();
  eduGroupOptions: CustomFieldData = new CustomFieldData();
  eduLevelOptions: CustomFieldData = new CustomFieldData();
  organizationOptions: CustomFieldData = new CustomFieldData();
  organizationTableConfig: TableConfig = new TableConfig(0);
  organizationTableData: Data<Organization> = new Data<Organization>();
  organizations: Array<Organization> = [];
  pendingOrgIndex: number;
  @ViewChild('f') form: NgForm;

  constructor(
    private dialogRef: MatDialogRef<PersonFormComponent>,
    @Inject(MAT_DIALOG_DATA) public data: PersonGeneral,
    private personService: PersonService,
    private eduGroupDialog: MatDialog,
    private eduGroupService: EduGroupService,
    private eduFieldDialog: MatDialog,
    private eduFieldService: EduFieldService,
    private organizationService: OrganizationService
  ) {}

  ngOnInit() {
    this.mode = (this.data.id == undefined) ? 0 : 1;
    this.title = (this.data.id == undefined) ? 'جدید' : 'ویرایش';
    if (!this.data.profEduGroup) this.data.profEduGroup = new EduGroup();
    if (!this.data.stdnEduField) this.data.stdnEduField = new EduField();
    if (!this.data.orgRepOrganizations) this.data.orgRepOrganizations = [];
    this.organizationTableData.records = this.data.orgRepOrganizations;
    this.eduGroupOptions.label = 'گروه آموزشی';
    this.eduFieldOptions.label = 'رشته تحصیلی';
    this.eduLevelOptions.label = 'مقطع تحصیلی';
    this.organizationOptions.label = 'انتخاب شرکت/سازمان';
    this.genderOptions.label = 'جنسیت';
    this.genderOptions.options = [
      {value: 0, title: 'مرد'},
      {value: 1, title: 'زن'}
    ];
    this.eduLevelOptions.options = [
      {value: 0, title: 'کاردانی'},
      {value: 1, title: 'کارشناسی'},
      {value: 2, title: 'کارشناسی ارشد'},
      {value: 3, title: 'دکتری'}
    ];
    this.organizationTableConfig.hasDelete = true;
    this.organizationTableConfig.columns = [
      {for: 'name', dbName: 'OrgName', title: 'نام', sortable: false, hasSearch: false},
      {for: 'nationalId', dbName: 'OrgNationalID', title: 'شناسه ملی', sortable: false, hasSearch: false},
      {for: 'registrationNo', dbName: 'OrgRegistrationNo', title: 'کد ثبت', sortable: false, hasSearch: false}
    ];

    this.onSelectType();
  }

  getEduFieldOptions() {
    this.eduFieldOptions.options = [];
    this.eduFieldOptions.loading = true;
    let efData: Data<EduField> = new Data<EduField>();
    efData.pageSize = null;
    this.eduFieldService.get(efData).subscribe(result => {
      this.eduFieldOptions.loading = false;
      let inList: boolean = false;
      result.records.forEach(eduField => {
        this.eduFieldOptions.options.push({value: eduField.id, title: eduField.name});
        if (this.eduFieldOptions.selectedValue && !inList)
          inList = this.eduFieldOptions.selectedValue === eduField.id;
      });
      if (this.eduFieldOptions.selectedValue && !inList)
        this.eduFieldOptions.options.push({value: this.data.stdnEduField.id, title: this.data.stdnEduField.name});
    }, err => {
      this.eduFieldOptions.loading = false;
      this.eduFieldOptions.loadingFailed = true;
    });
  }

  getEduGroupOptions() {
    this.eduGroupOptions.options = [];
    this.eduGroupOptions.loading = true;
    let egData: Data<EduGroup> = new Data<EduGroup>();
    egData.pageSize = null;
    this.eduGroupService.get(egData).subscribe(result => {
      this.eduGroupOptions.loading = false;
      let inList: boolean = false;
      result.records.forEach(eduGroup => {
        this.eduGroupOptions.options.push({value: eduGroup.id, title: eduGroup.name, fieldValue: eduGroup.name});
        if (this.eduGroupOptions.selectedValue && !inList)
          inList = this.eduGroupOptions.selectedValue === eduGroup.id;
      });
      if (this.eduGroupOptions.selectedValue && !inList)
        this.eduGroupOptions.options.push({value: this.data.profEduGroup.id, title: this.data.profEduGroup.name});
    }, err => {
      this.eduGroupOptions.loading = false;
      this.eduGroupOptions.loadingFailed = true;
    });
  }

  getOrganizationOptions() {
    this.organizationOptions.options = [];
    this.organizationOptions.loading = true;
    let orgData: Data<Organization> = new Data<Organization>();
    orgData.pageSize = null;
    this.organizationService.get(orgData).subscribe(result => {
      this.organizationOptions.loading = false;
      this.organizations = result.records;
      result.records.forEach(org => {
        let isInList = false;
        for (let orgInList of this.data.orgRepOrganizations) {
          if (org.id === orgInList.id) {
            isInList = true;
            break;
          }
        }
        if (!isInList) this.organizationOptions.options.push({value: org.id, title: org.name});
      });
    }, err => {
      this.organizationOptions.loading = false;
      this.organizationOptions.loadingFailed = true;
    });
  }

  onSelectType() {
    if (this.data.typeProf) this.getEduGroupOptions();
    if (this.data.typeStdn) this.getEduFieldOptions();
    if (this.data.typeOrg) this.getOrganizationOptions();
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
        this.eduGroupOptions.options.push({value: eg.id, title: eg.name});
        this.data.profEduGroupId = eg.id;
        this.data.profEduGroup = eg;
      }
    });
  }

  openEduFieldForm() {
    let data: EduField = new EduField();

    const dialogRef = this.eduFieldDialog.open(EduFieldFormComponent, {
      width: '850px',
      direction: 'rtl',
      disableClose: true,
      data: data
    });

    dialogRef.afterClosed().subscribe(ef => {
      if(ef) {
        this.eduGroupOptions.options.push({value: ef.id, title: ef.name});
        this.data.stdnEduFieldId = ef.id;
        this.data.stdnEduField = ef;
      }
    });
  }

  isLabPrsnlFormEmpty(): boolean {
    return ((!this.data.labPersonnelCode) || (this.data.labPersonnelCode == '')) &&
           ((!this.data.labPost) || (this.data.labPost == ''));
  }

  isProfFormEmpty(): boolean {
    return ((!this.data.profPersonnelCode) || (this.data.profPersonnelCode == '')) && !this.data.profEduGroupId;
  }

  isStdnFormEmpty(): boolean {
    return ((!this.data.stdnCode) || (this.data.stdnCode == '')) && !this.data.stdnEduLevel && !this.data.stdnEduFieldId;
  }

  onSelectOrganization() {
    this.organizations.forEach((org, i) => {
      if (org.id === this.organizationOptions.selectedValue)
        this.pendingOrgIndex = i;
    });
  }

  onAddOrganization() {
    this.data.orgRepOrganizations.push(this.organizations[this.pendingOrgIndex]);
    this.organizationOptions.options.forEach((opt, i) => {
      if (opt.value === this.organizations[this.pendingOrgIndex].id)
        this.organizationOptions.options.splice(i, 1);
    });
    this.pendingOrgIndex = null;
    this.organizationOptions.selectedValue = null;
  }

  onRemoveOrganization(index: number) {
    this.organizationOptions.options.push({
      value: this.data.orgRepOrganizations[index].id,
      title: this.data.orgRepOrganizations[index].name
    });
    this.data.orgRepOrganizations.splice(index, 1);
  }

  onSubmit() {
    if (this.form.valid) this.submit();
  }

  submit() {
    this.reachingOut = true;
    if (this.mode === 0) {
      this.personService.create(this.data).subscribe(res => {
        this.reachingOut = false;
        this.submitted = true;
        swal({title: 'موفق', text: `شخص جدید با موفقیت ثبت شد.`, icon: 'success'}).then(() => {
          this.dialogRef.close(this.submitted)
        });
      }, err => {
        this.reachingOut = false;
        swal({title: 'ناموفق', icon: 'error'});
      });
    } else {
      this.personService.update(this.data).subscribe(res => {
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
