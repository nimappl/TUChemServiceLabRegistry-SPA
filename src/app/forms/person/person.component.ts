import { Component } from '@angular/core';
import {TableConfig} from "../../data-table/table-config";
import { PersonService } from "../../services/person.service";
import {MatDialog} from "@angular/material/dialog";
import { PersonFormComponent } from "./person-form/person-form.component";
import {Data, Filter, LabPersonnel, Organization, OrgRepresentative, PersonGeneral, TUStudent} from "../../model";
import {CustomFieldData} from "../../custom-fields/custom-field-data";
import {PersonType} from "./PersonType";
import {DeletePersonFormComponent} from "./delete-person-form/delete-person-form.component";

@Component({
  selector: 'app-person',
  templateUrl: './person.component.html',
  styleUrls: ['./person.component.css']
})
export class PersonComponent {
  persons: Data<PersonGeneral>;
  table: TableConfig = new TableConfig(1);
  selectedItem: PersonGeneral = null;
  typeOptions: CustomFieldData = new CustomFieldData();
  transformGender = a => a ? 'زن' : 'مرد';
  transformEduLevel = e => TUStudent.getLevel(e);
  organizationsTableConfig: TableConfig = new TableConfig(0);
  organizationsTableData: Data<Organization>;

  constructor(private personService: PersonService,
              public formDialog: MatDialog,
              public deleteDialog: MatDialog) {}

  ngOnInit() {
    this.typeOptions.label = 'انتخاب دسته بندی';
    this.typeOptions.options = [
      {value: PersonType.LabPersonnel, title: 'پرسنل آزمایشگاه'},
      {value: PersonType.Professor, title: 'هیأت علمی دانشگاه تبریز'},
      {value: PersonType.Student, title: 'دانشجوی دانشگاه تبریز'},
      {value: PersonType.Representative, title: 'نماینده شرکت/سازمان'},
      {value: PersonType.General, title: 'همه'}
    ];
    this.organizationsTableConfig.columns = [
      {for: 'name', dbName: 'OrgName', title: 'نام', sortable: true, hasSearch: true},
      {for: 'nationalId', dbName: 'OrgNationalID', title: 'شناسه ملی', sortable: true, hasSearch: true},
      {for: 'registrationNo', dbName: 'OrgRegistrationNo', title: 'کد ثبت', sortable: true, hasSearch: true}
    ];
    this.typeOptions.selectedValue = PersonType.General;
    this.onSelectType();
  }

  fetch(tableLoading:boolean = false): void {
    let options = JSON.parse(JSON.stringify(this.persons));
    options.records = [];
    this.table.loading = true;
    this.table.sorting = tableLoading;

    this.personService.get(options).subscribe(result => {
      this.table.loading = false;
      this.table.sorting = false;
      this.persons = result;
    }, error => {
      this.table.loading = false;
      this.table.sorting = false;
      this.table.loadingFailed = true;
    });
  }

  openForm(item?: any): void {
    let data: PersonGeneral;
    if (item) data = item; else data = new PersonGeneral();

    const dialogRef = this.formDialog.open(PersonFormComponent, {
      width: '850px',
      maxHeight: '95vh',
      direction: 'rtl',
      disableClose: true,
      data: data
    });

    dialogRef.afterClosed().subscribe(submitted => {
      if(submitted) this.fetch(true);
    });
  }

  onSelectType() {
    this.selectedItem = null;
    this.persons = new Data<PersonGeneral>();
    switch (this.typeOptions.selectedValue) {
      case PersonType.LabPersonnel:
        this.persons.filters.push(new Filter('PTypeLab', 1));
        this.table.buttons = null;
        this.table.buttonTitles = null;
        this.table.columns = [
          {for: 'nationalNumber', dbName: 'PNationalNumber', title: 'کد ملی', sortable: true, hasSearch: true},
          {for: 'firstName', dbName: 'PFirstName', title: 'نام', sortable: true, hasSearch: true},
          {for: 'lastName', dbName: 'PLastName', title: 'نام خانوادگی', sortable: true, hasSearch: true},
          {for: 'labPersonnelCode', dbName: 'LPCode', title: 'کد پرسنلی', sortable: true, hasSearch: true},
          {for: 'labPost', dbName: 'LPPost', title: 'سمت', sortable: true, hasSearch: true}
        ];
        break;
      case PersonType.Professor:
        this.persons.filters.push(new Filter('PTypeProf', 1));
        this.table.buttons = null;
        this.table.buttonTitles = null;
        this.table.columns = [
          {for: 'nationalNumber', dbName: 'PNationalNumber', title: 'کد ملی', sortable: true, hasSearch: true},
          {for: 'firstName', dbName: 'PFirstName', title: 'نام', sortable: true, hasSearch: true},
          {for: 'lastName', dbName: 'PLastName', title: 'نام خانوادگی', sortable: true, hasSearch: true},
          {for: 'profEduGroup', dbName: 'ProfEduGroupId', title: 'گروه آموزشی', sortable: true, hasSearch: false, transform: value => value ? value.name : ''}
        ];
        break;
      case PersonType.Student:
        this.persons.filters.push(new Filter('PTypeStdn', 1));
        this.table.buttons = null;
        this.table.buttonTitles = null;
        this.table.columns = [
          {for: 'nationalNumber', dbName: 'PNationalNumber', title: 'کد ملی', sortable: true, hasSearch: true},
          {for: 'firstName', dbName: 'PFirstName', title: 'نام', sortable: true, hasSearch: true},
          {for: 'lastName', dbName: 'PLastName', title: 'نام خانوادگی', sortable: true, hasSearch: true},
          {for: 'stdnCode', dbName: 'StCode', title: 'شماره دانشجویی', sortable: true, hasSearch: true},
          {for: 'stdnEduField', dbName: 'StEduFieldID', title: 'رشته تحصیلی', sortable: false, hasSearch: true, transform: value => value ? value.name : ''},
          {for: 'stdnEduLevel', dbName: 'StLevel', title: 'مقطع تحصیلی', sortable: true, hasSearch: true, transform: value => TUStudent.getLevel(value)}
        ];
        break;
      case PersonType.Representative:
        this.persons.filters.push(new Filter('PTypeOrg', 1));
        this.table.buttonTitles = ['شرکت‌های مطبوعه'];
        this.table.buttons = [{title: 'مشاهده', id: 1, altText: ''}];
        this.table.columns = [
          {for: 'nationalNumber', dbName: 'PNationalNumber', title: 'کد ملی', sortable: true, hasSearch: true},
          {for: 'firstName', dbName: 'PFirstName', title: 'نام', sortable: true, hasSearch: true},
          {for: 'lastName', dbName: 'PLastName', title: 'نام خانوادگی', sortable: true, hasSearch: true},
          {for: 'phoneNumber', dbName: 'PPhoneNumber', title: 'تلفن تماس', sortable: true, hasSearch: true}
        ];
        break;
      case PersonType.General:
        this.table.buttonTitles = ['اطلاعات بیشتر'];
        this.table.buttons = [{title: 'مشاهده', id: 1, altText: ''}];
        this.table.columns = [
          {for: 'nationalNumber', dbName: 'PNationalNumber', title: 'کد ملی', sortable: true, hasSearch: true},
          {for: 'firstName', dbName: 'PFirstName', title: 'نام', sortable: true, hasSearch: true},
          {for: 'lastName', dbName: 'PLastName', title: 'نام خانوادگی', sortable: true, hasSearch: true},
          {for: 'phoneNumber', dbName: 'PPhoneNumber', title: 'تلفن تماس', sortable: true, hasSearch: true}
        ];
        break;
    }
    this.fetch(true);
  }

  toggleSearch() {
    if (this.table.showSearch) {
      this.persons.filters = [];
      this.fetch();
    }

    this.table.showSearch = !this.table.showSearch;
  }

  buttonClicked(item: {btnId: number, record: PersonGeneral}) {
    this.selectedItem = item.record;
    console.log(this.selectedItem)
    if (this.selectedItem.typeOrg) {
      this.organizationsTableData = new Data<Organization>();
      this.organizationsTableData.records = this.selectedItem.orgRepOrganizations;
    }
  }

  onRemoveItem(index: number) {
    const dialogRef = this.deleteDialog.open(DeletePersonFormComponent, {
      width: '420px',
      direction: 'rtl',
      disableClose: true,
      data: this.persons.records[index]
    });

    dialogRef.afterClosed().subscribe(submitted => {
      if(submitted) this.fetch(true);
    });
  }
}
