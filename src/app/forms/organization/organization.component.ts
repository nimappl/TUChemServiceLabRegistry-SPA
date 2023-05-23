import { Component } from '@angular/core';
import {Data, Organization, OrgPhoneNumber, OrgRepresentative} from "../../model";
import {TableConfig} from "../../data-table/table-config";
import {OrganizationService} from "../../services/organization.service";
import {MatDialog} from "@angular/material/dialog";
import {OrganizationFormComponent} from "./organization-form/organization-form.component";
import swal from "sweetalert";

@Component({
  selector: 'app-organization',
  templateUrl: './organization.component.html',
  styleUrls: ['./organization.component.css']
})
export class OrganizationComponent {
  organizations: Data<Organization> = new Data<Organization>;
  table: TableConfig = new TableConfig(1);
  phoneNumberTable: TableConfig = new TableConfig(0);
  representativesTable: TableConfig = new TableConfig(0);
  phoneNumberData: Data<OrgPhoneNumber> = new Data<OrgPhoneNumber>();
  representativesData: Data<OrgRepresentative> = new Data<OrgRepresentative>();
  selectedItem: Organization = null;

  constructor(private apiService: OrganizationService,
              public dialog: MatDialog) {}

  ngOnInit() {
    this.table.columns = [
      {for: 'name', dbName: 'OrgName', title: 'نام', sortable: true, hasSearch: true},
      {for: 'nationalId', dbName: 'OrgNationalID', title: 'شناسه ملی', sortable: true, hasSearch: true},
      {for: 'contractNo', dbName: 'OrgContractNo', title: 'شماره قرارداد', sortable: true, hasSearch: true}
    ];

    this.fetch(true);
  }

  fetch(tableLoading:boolean = false): void {
    let options = JSON.parse(JSON.stringify(this.organizations));
    options.records = [];
    this.table.loading = true;
    this.table.sorting = tableLoading;
    this.apiService.get(options).subscribe(res => {
      this.table.loading = false;
      this.table.sorting = false;
      this.organizations = res;
    }, err => {
      this.table.loading = false;
      this.table.sorting = false;
      this.table.loadingFailed = true;
    });
  }

  openForm(item?: any): void {
    let data: Organization;
    if (item) data = item; else data = new Organization();

    const dialogRef = this.dialog.open(OrganizationFormComponent, {
      width: '850px',
      maxHeight: '95vh',
      direction: 'rtl',
      disableClose: true,
      data: data
    });

    dialogRef.afterClosed().subscribe(submitted => {
      if(submitted) {
        this.fetch(true);
        this.selectedItem = null;
      }
    });
  }

  showDetailsOf(item: {btnId: number, record: Organization}) {
    this.selectedItem = item.record;
    this.phoneNumberData.records = this.selectedItem.phoneNumbers;
    this.representativesData.records = this.selectedItem.representatives;
    this.phoneNumberTable.columns = [
      {for: 'number', dbName: 'OrgPhoneNumber', title: 'شماره تلفن', sortable: false, hasSearch: false},
      {for: 'section', dbName: 'OrgPNSection', title: 'توضیحات', sortable: false, hasSearch: false}
    ];
    this.representativesTable.columns = [
      {for: 'nationalNumber', dbName: 'PNationalNumber', title: 'کد ملی', sortable: false, hasSearch: false},
      {for: 'firstName', dbName: 'PFirstName', title: 'نام', sortable: false, hasSearch: false},
      {for: 'lastName', dbName: 'PLastName', title: 'نام خانوادگی', sortable: false, hasSearch: false},
      {for: 'phoneNumber', dbName: 'PPhoneNumber', title: 'تلفن تماس', sortable: false, hasSearch: false}
    ];
  }

  toggleSearch() {
    if (this.table.showSearch) {
      this.organizations.filters = [];
      this.fetch();
    }

    this.table.showSearch = !this.table.showSearch;
  }

  onRemoveItem(index: number) {
    swal({
      title: 'حذف',
      text: `آیا از حذف شرکت/سازمان "${this.organizations.records[index].name}" اطمینان دارید؟`,
      icon: 'warning',
      buttons: ['انصراف', 'تأیید'],
      dangerMode: true
    }).then(deleteConfirm => {
      if (deleteConfirm) {
        this.table.loading = true;
        this.apiService.delete(this.organizations.records[index].id).subscribe(res => {
          this.table.loading = false;
          swal({title: 'موفق', text: `عملیات حذف انجام شد.`, icon: 'success'});
          this.fetch();
        }, err => {
          this.table.loading = false;
          swal({title: 'ناموفق', icon: 'error'});
        });
      }
    });
  }
}
