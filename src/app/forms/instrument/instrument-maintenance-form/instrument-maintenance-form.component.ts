import {Component, Inject, ViewChild} from '@angular/core';
import {CustomFieldData} from "../../../custom-fields/custom-field-data";
import {NgForm} from "@angular/forms";
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {Data, IMUsedMaterial, InstrumentMaintenance, Organization, Person} from "../../../model";
import {InstrumentMaintenanceService} from "../../../services/instrument-maintenance.service";
import swal from "sweetalert";
import {OrganizationService} from "../../../services/organization.service";
import {PersonService} from "../../../services/person.service";
import {UsedMaterialService} from "../../../services/used-material.service";

@Component({
  selector: 'app-instrument-maintenance-form',
  templateUrl: './instrument-maintenance-form.component.html',
  styleUrls: ['./instrument-maintenance-form.component.css']
})
export class InstrumentMaintenanceFormComponent {
  mode: number; // 0: new, 1: edit
  dialogTitle: string;
  reachingOut: boolean = false;
  submitted: boolean = false;
  dateOptions: CustomFieldData = new CustomFieldData();
  genderOptions: CustomFieldData = new CustomFieldData();
  personSearchOptions: CustomFieldData = new CustomFieldData();
  organizationSearchOptions: CustomFieldData = new CustomFieldData();
  materialOptions: Array<{searchOptions: CustomFieldData, typeOptions: CustomFieldData}> = [];
  pendingServiceman: Person = new Person();
  pendingCompany: Organization = new Organization();
  personSelectedFromDB: boolean = false;
  companySelectedFromDB: boolean = false;
  @ViewChild('f') form: NgForm;
  getMaterialType = IMUsedMaterial.getType;
  getMaterialUnit = IMUsedMaterial.getTypeUnit;

  constructor(
    private dialogRef: MatDialogRef<InstrumentMaintenanceFormComponent>,
    @Inject(MAT_DIALOG_DATA) public data: InstrumentMaintenance,
    private maintenanceService: InstrumentMaintenanceService,
    private personService: PersonService,
    private organizationService: OrganizationService,
    private usedMaterialService: UsedMaterialService
  ) {}

  ngOnInit() {
    this.mode = (!this.data.id) ? 0 : 1;
    this.dialogTitle = (!this.data.id) ? 'جدید' : 'ویرایش';

    this.dateOptions.label = 'تاریخ';
    this.personSearchOptions.label = 'نام تعمیرکار';
    this.organizationSearchOptions.label = 'نام شرکت ارائه دهنده تعمیرات/خدمات';
    if (!this.data.usedMaterialList) this.data.usedMaterialList = [];
    if (!this.data.serviceman) this.data.serviceman = new Person();
    if (!this.data.servicingCompany) this.data.servicingCompany = new Organization();
    this.data.usedMaterialList.forEach((m, i) => {
      this.materialOptions.push({
        searchOptions: new CustomFieldData(),
        typeOptions: new CustomFieldData()
      });
      this.materialOptions[i].searchOptions.label = 'نام ماده/قطعه';
      this.materialOptions[i].typeOptions.label = 'نوع';
      this.materialOptions[i].typeOptions.options = [
        {title: 'قطعه', value: 0},
        {title: 'مایع', value: 1},
        {title: 'گاز', value: 2},
        {title: 'جامد', value: 3}
      ];
    });
    this.genderOptions.label = 'جنسیت';
    this.genderOptions.options = [
      {title: 'مرد', value: 0},
      {title: 'زن', value: 1},
      {title: 'بدون انتخاب', value: null}
    ];
  }

  onSearchPerson() {
    this.personSearchOptions.options = [];
    this.personSearchOptions.loading = true;
    this.personService.queryByFullName(this.personSearchOptions.searchText).subscribe(res => {
      this.personSearchOptions.loading = false;
      this.personSearchOptions.loadingFailed = false;
      res.forEach(person => {
        this.personSearchOptions.options.push({value: person.id, title: `${person.firstName} ${person.lastName}`, fieldValue: person.firstName});
      });
    }, err => {
      this.personSearchOptions.loading = false;
      this.personSearchOptions.loadingFailed = true;
    });
  }

  onSearchOrganization() {
    this.organizationSearchOptions.options = [];
    this.organizationSearchOptions.loading = true;
    this.organizationService.queryByName(this.organizationSearchOptions.searchText).subscribe(res => {
      this.organizationSearchOptions.loading = false;
      this.organizationSearchOptions.loadingFailed = false;
      res.forEach(org => {
        this.organizationSearchOptions.options.push({value: org.id, title: org.name, fieldValue: org.name});
      });
    }, err => {
      this.organizationSearchOptions.loading = false;
      this.organizationSearchOptions.loadingFailed = true;
    });
  }

  onSearchMaterial(index: number) {
    this.materialOptions[index].searchOptions.options = [];
    this.materialOptions[index].searchOptions.loading = true;
    this.usedMaterialService.queryByName(this.materialOptions[index].searchOptions.searchText).subscribe(res => {
      this.materialOptions[index].searchOptions.loading = false;
      res.forEach(material => {
        let isInList = false;
        for (let materialInList of this.data.usedMaterialList) {
          if (material.id === materialInList.id) {
            isInList = true;
            break;
          }
        }
        if (!isInList) {
          let title = material.name;
          if (material.manufacturer !== null) title += `, ${material.manufacturer}`;
          this.materialOptions[index].searchOptions.options.push({
            title: title,
            value: material.id
          });
        }
      });
    }, err => {
      this.materialOptions[index].searchOptions.loading = false;
      this.materialOptions[index].searchOptions.loadingFailed = false;
    });
  }

  onSelectPerson() {
    this.personService.getById(this.personSearchOptions.selectedValue).subscribe(res => {
      this.data.serviceman = res;
    });
  }

  onSelectOrganization() {
    this.organizationService.getById(this.organizationSearchOptions.selectedValue).subscribe(res => {
      this.data.servicingCompany = res;
    });
  }

  onSelectMaterial(index: number) {
    this.usedMaterialService.getById(this.materialOptions[index].searchOptions.selectedValue).subscribe(res => {
      this.data.usedMaterialList[index] = res;
    });
  }

  onDropSelectedPerson() {
    this.data.serviceman = new Person();
  }

  onDropSelectedOrganization() {
    this.data.servicingCompany = new Organization();
  }

  onAddMaterial() {
    this.data.usedMaterialList.push(new IMUsedMaterial());
    // this.data.usedMaterialList[this.data.usedMaterialList.length - 1].name = '';
    this.materialOptions.push({
      searchOptions: new CustomFieldData(),
      typeOptions: new CustomFieldData()
    });
    this.materialOptions[this.materialOptions.length - 1].searchOptions.label = 'نام ماده/قطعه';
    this.materialOptions[this.materialOptions.length - 1].typeOptions.label = 'نوع';
    this.materialOptions[this.materialOptions.length - 1].typeOptions.options = [
      {title: 'قطعه', value: 0},
      {title: 'مایع', value: 1},
      {title: 'گاز', value: 2},
      {title: 'جامد', value: 3}
    ];
  }

  onRemoveMaterial(index: number) {
    this.data.usedMaterialList.splice(index, 1);
    this.materialOptions.splice(index, 1);
  }

  calculateMaterialsPrice(): number {
    let total: number = 0;
    if (this.data.usedMaterialList) {
      this.data.usedMaterialList.forEach(material => {
        if (material.price && material.quantity) {
          total += material.price * material.quantity;
        }
      });
    }
    return total;
  }

  isPersonFormEmpty(): boolean {
    return (!this.data.serviceman.firstName || this.data.serviceman.firstName === '') &&
           (!this.data.serviceman.lastName || this.data.serviceman.lastName === '') &&
           (!this.data.serviceman.nationalNumber || this.data.serviceman.nationalNumber === '') &&
           (!this.data.serviceman.phoneNumber || this.data.serviceman.phoneNumber === '') &&
           (this.data.serviceman.gender == null);
  }

  isOrgFormEmpty(): boolean {
    return (!this.data.servicingCompany.name || this.data.servicingCompany.name === '') &&
           (!this.data.servicingCompany.nationalId || this.data.servicingCompany.nationalId === '');
  }

  onSubmit() {
    if (this.form.valid) {
      this.data.servicemanId = this.data.serviceman.id;
      this.data.servicingCompanyId = this.data.servicingCompany.id;
      if (this.isPersonFormEmpty()) this.data.serviceman = null;
      if (this.isOrgFormEmpty()) this.data.servicingCompany = null;
      this.submit();
    }
  }

  submit() {
    this.reachingOut = true;
    if (this.mode === 0) {
      this.maintenanceService.create(this.data).subscribe(res => {
        this.reachingOut = false;
        this.submitted = true;
        swal({title: 'موفق', text: `اقدام تعمیر و نگه‌داری با موفقیت ثبت شد.`, icon: 'success'}).then(() => {
          this.dialogRef.close(this.submitted)
        });
      }, err => {
        this.reachingOut = false;
        swal({title: 'ناموفق', icon: 'error'});
      });
    } else {
      this.maintenanceService.update(this.data).subscribe(res => {
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
