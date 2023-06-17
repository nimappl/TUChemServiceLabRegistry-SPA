import { Component } from '@angular/core';
import {Data, Discount, OrgPhoneNumber, Service, TestFee, TestPrep, TService, TUStudent} from "../../model";
import {TableConfig} from "../../data-table/table-config";
import {ServiceService} from "../../services/service.service";
import {MatDialog} from "@angular/material/dialog";
import {ServiceFormComponent} from "./service-form/service-form.component";
import swal from "sweetalert";
import {DateConvertor} from "../../custom-fields/jalali-date-picker/date-convertor";
import * as constants from "constants";

@Component({
  selector: 'app-service',
  templateUrl: './service.component.html',
  styleUrls: ['./service.component.css']
})
export class ServiceComponent {
  services: Data<TService> = new Data<TService>;
  serviceTable: TableConfig = new TableConfig(1);
  discountsTable: TableConfig = new TableConfig(0);
  samplePrepsTable: TableConfig = new TableConfig(0);
  orgPhoneTable: TableConfig = new TableConfig(0);
  discountsData: Data<Discount>;
  samplePrepsData: Data<TestPrep>;
  orgPhoneData: Data<OrgPhoneNumber>;
  loadingDetails: boolean = false;
  loadingDetailsFailed: boolean = false;
  selectedItem: Service = null;
  convertDate = d => DateConvertor.dateStringToJalali(d);
  transformGender = a => a ? 'زن' : 'مرد';
  transformEduLevel = e => TUStudent.getLevel(e);

  constructor(private apiService: ServiceService,
              public dialog: MatDialog) {}

  ngOnInit() {
    this.serviceTable.columns = [
      {for: 'testName', dbName: 'TestName', title: 'عنوان آزمون', sortable: true, hasSearch: true},
      {for: 'sampleQuantity', dbName: 'SSampleQuantity', title: 'تعداد نمونه', sortable: true, hasSearch: true},
      {for: 'customerName', dbName: 'CustomerName', title: 'نام متقاضی', sortable: true, hasSearch: true},
      {for: 'date', dbName: 'SDate', title: 'تاریخ', sortable: true, hasSearch: false, transform: d => DateConvertor.dateStringToJalali(d)},
      {for: 'totalPrice', dbName: 'STotalPrice', title: 'هزینه کل', sortable: true, hasSearch: true, transform: p => p + ' ریال'}
    ];
    this.samplePrepsTable.columns = [
      {for: 'type', dbName: '', title: 'عنوان', sortable: false, hasSearch: false},
      {for: 'price', dbName: '', title: 'هزینه', sortable: false, hasSearch: false, transform: p => p + ' ریال'}
    ];
    this.discountsTable.columns = [
      {for: 'getType', dbName: '', title: 'عنوان', sortable: false, hasSearch: false, isFunction: true},
      {for: 'percent', dbName: '', title: 'درصد', sortable: false, hasSearch: false, transform: p => p + ' ٪'}
    ];
    this.orgPhoneTable.columns = [
      {for: 'number', dbName: '', title: 'شماره تلفن', hasSearch: false, sortable: false},
      {for: 'section', dbName: '', title: 'توضیح', hasSearch: false, sortable: false}
    ]
    this.fetch(true);
  }

  fetch(tableLoading:boolean = false): void {
    let options = JSON.parse(JSON.stringify(this.services));
    options.records = [];
    this.serviceTable.loading = true;
    this.serviceTable.sorting = tableLoading;
    this.apiService.get(options).subscribe(res => {
      this.serviceTable.loading = false;
      this.serviceTable.sorting = false;
      this.services = res;
    }, err => {
      this.serviceTable.loading = false;
      this.serviceTable.sorting = false;
      this.serviceTable.loadingFailed = true;
    });
  }

  onEditItem(item: TService) {
    let service: Service;
    this.apiService.getById(item.id).subscribe(res => {
      service = new Service(res);
      this.openForm(service);
    });
  }

  openForm(item?: any): void {
    let data: Service;
    if (item) data = item; else data = new Service();

    const dialogRef = this.dialog.open(ServiceFormComponent, {
      width: '850px',
      direction: 'rtl',
      disableClose: true,
      data: data
    });

    dialogRef.afterClosed().subscribe(submitted => {
      if(submitted) this.fetch(true);
    });
  }

  showDetailsOf(item: any) {
    this.selectedItem = null;
    this.loadingDetails = true;
    this.apiService.getById(item.record.id).subscribe(res => {
      this.selectedItem = new Service(res);
      this.selectedItem.testFee = new TestFee(res.testFee);
      this.selectedItem.discounts = [];
      res.discounts.forEach(d => this.selectedItem.discounts.push(new Discount(d)));
      this.samplePrepsData = new Data<TestPrep>();
      this.discountsData = new Data<Discount>();
      this.samplePrepsData.records = this.selectedItem.testPreps;
      this.discountsData.records = this.selectedItem.discounts;
      if (res.customerAccount.type == 2) {
        this.orgPhoneData = new Data<OrgPhoneNumber>();
        this.orgPhoneData.records = this.selectedItem.customerAccount.custOrganization.phoneNumbers;
      }
      this.loadingDetails = false;
    }, err => {
      this.loadingDetails = false;
      this.loadingDetailsFailed = true;
    });
  }

  formatDescription(val:string):string {
    if (val) return val.replace(/(\r\n|\r|\n)/g, '<br>');
  }

  toggleSearch() {
    if (this.serviceTable.showSearch) {
      this.services.filters = [];
      this.fetch();
    }

    this.serviceTable.showSearch = !this.serviceTable.showSearch;
  }

  onRemoveItem(index: number) {
    swal({
      title: 'حذف',
      text: `آیا از حذف خدمت "${this.services.records[index].testName} " اطمینان دارید؟`,
      icon: 'warning',
      buttons: ['انصراف', 'تأیید'],
      dangerMode: true
    }).then(deleteConfirm => {
      if (deleteConfirm) {
        this.serviceTable.loading = true;
        this.apiService.delete(this.services.records[index].id).subscribe(res => {
          this.serviceTable.loading = false;
          swal({title: 'موفق', text: `عملیات حذف انجام شد.`, icon: 'success'});
          this.fetch();
        }, err => {
          this.serviceTable.loading = false;
          swal({title: 'ناموفق', icon: 'error'});
        });
      }
    });
  }
}
