import { Component } from '@angular/core';
import {Instrument, Data, InstrumentMaintenance, InstrumentOperator, IMUsedMaterial, OrgPhoneNumber} from '../../model'
import { MatDialog } from "@angular/material/dialog";
import { InstrumentFormComponent } from "./instrument-form/instrument-form.component";
import { InstrumentService } from "../../services/instrument.service";
import swal from "sweetalert";
import {TableConfig} from "../../data-table/table-config";
import {InstrumentMaintenanceFormComponent} from "./instrument-maintenance-form/instrument-maintenance-form.component";
import {InstrumentMaintenanceService} from "../../services/instrument-maintenance.service";
import {SortType} from "../../model/data";
import {DateConvertor} from "../../custom-fields/jalali-date-picker/date-convertor";

@Component({
  selector: 'app-instrument',
  templateUrl: './instrument.component.html',
  styleUrls: ['./instrument.component.css']
})
export class InstrumentComponent {
  instruments: Data<Instrument> = new Data<Instrument>();
  instrumentTableConfig: TableConfig = new TableConfig(1);
  maintenanceTableConfig: TableConfig = new TableConfig(1);
  operatorsTableConfig: TableConfig = new TableConfig(0);
  usedMaterialTableConfig: TableConfig = new TableConfig(0);
  orgPhoneNumberTableConfig: TableConfig = new TableConfig(0);
  orgPhoneNumberData: Data<OrgPhoneNumber> = new Data<OrgPhoneNumber>();
  maintenanceData: Data<InstrumentMaintenance>;
  operatorsData: Data<InstrumentOperator> = new Data<InstrumentOperator>();
  usedMaterialData: Data<IMUsedMaterial> = new Data<IMUsedMaterial>();
  selectedInstrument: Instrument = null;
  selectedMaintenance: InstrumentMaintenance = null;

  constructor(private instrumentService: InstrumentService,
              private maintenanceService: InstrumentMaintenanceService,
              public dialog: MatDialog) {}

  ngOnInit() {
    this.instrumentTableConfig.columns = [
      {for: 'name', dbName: 'IName', title: 'نام دستگاه', sortable: true, hasSearch: true},
      {for: 'model', dbName: 'IModel', title: 'مدل', sortable: true, hasSearch: true},
      {for: 'manufacturer', dbName: 'IManufacturer', title: 'شرکت سازنده', sortable: true, hasSearch: true},
      {for: 'serviceable', dbName: 'IServiceable', title: 'وضعیت سرویس دهی', sortable: false, hasSearch: false, transform: value => Instrument.getServiceability(value)}
    ];
    this.fetchInstrument(true);
  }

  formatDescription(val:string):string {
    return val.replace(/(\r\n|\r|\n)/g, '<br>');
  }

  fetchInstrument(tableLoading:boolean = false): void {
    let options = JSON.parse(JSON.stringify(this.instruments));
    options.records = [];
    this.instrumentTableConfig.loading = true;
    this.instrumentTableConfig.sorting = tableLoading;
    this.instrumentService.get(options).subscribe(res => {
      this.instrumentTableConfig.loading = false;
      this.instrumentTableConfig.sorting = false;
      this.instruments = res;
    }, err => {
      this.instrumentTableConfig.loading = false;
      this.instrumentTableConfig.sorting = false;
      this.instrumentTableConfig.loadingFailed = true;
    });
  }

  fetchMaintenance(tableLoading:boolean = false): void {
    let options = JSON.parse(JSON.stringify(this.maintenanceData));
    options.records = [];
    this.maintenanceTableConfig.loading = true;
    this.maintenanceTableConfig.sorting = tableLoading;
    this.maintenanceService.get(options).subscribe(res => {
      this.maintenanceTableConfig.loading = false;
      this.maintenanceTableConfig.sorting = false;
      this.maintenanceData = res;
    }, err => {
      this.maintenanceTableConfig.loading = false;
      this.maintenanceTableConfig.sorting = false;
      this.maintenanceTableConfig.loadingFailed = true;
    });
  }

  openInstrumentForm(item?: any): void {
    let data: Instrument;
    if (item) data = item; else data = new Instrument();

    const dialogRef = this.dialog.open(InstrumentFormComponent, {
      width: '850px',
      maxHeight: '95vh',
      direction: 'rtl',
      disableClose: true,
      data: data
    });

    dialogRef.afterClosed().subscribe(submitted => {
      if(submitted) {
        this.fetchInstrument(true);
        this.selectedInstrument = null;
        this.selectedMaintenance = null;
      }
    });
  }

  openMaintenanceForm(item?: any): void {
    let data: InstrumentMaintenance;
    if (item) data = item;
    else {
      data = new InstrumentMaintenance();
      data.instrumentId = this.selectedInstrument.id;
    }

    const dialogRef = this.dialog.open(InstrumentMaintenanceFormComponent, {
      width: '900px',
      maxHeight: '95vh',
      direction: 'rtl',
      disableClose: true,
      data: data
    });

    dialogRef.afterClosed().subscribe(submitted => {
      if(submitted) {
        this.fetchMaintenance(true);
        this.selectedMaintenance = null;
      }
    });
  }

  toggleInstrumentSearch() {
    if (this.instrumentTableConfig.showSearch) {
      this.instruments.filters = [];
      this.fetchInstrument();
    }

    this.instrumentTableConfig.showSearch = !this.instrumentTableConfig.showSearch;
  }

  toggleMaintenanceSearch() {
    if (this.maintenanceTableConfig.showSearch) {
      this.instruments.filters = [];
      this.fetchMaintenance();
    }
    this.maintenanceTableConfig.showSearch = !this.maintenanceTableConfig.showSearch;
  }

  showInstrumentDetails(item: {btnId: number, record: Instrument}) {
    this.selectedInstrument = item.record;
    this.operatorsData.records = item.record.operators;
    this.operatorsTableConfig.columns = [
      {for: 'nationalNumber', title: 'کد ملی', dbName: 'PNationalNumber', hasSearch: false, sortable: false},
      {for: 'firstName', title: 'نام', dbName: 'PFirstName', hasSearch: false, sortable: false},
      {for: 'lastName', title: 'نام خانوادگی', dbName: 'PLastName', hasSearch: false, sortable: false},
      {for: 'designationDate', title: 'اپراتوری دستگاه از تاریخ', dbName: 'DesignationDate', hasSearch: false, sortable: false, transform: d => DateConvertor.dateStringToJalali(d)},
      {for: 'type', title: 'نوع همکاری', dbName: 'IOperatorType', hasSearch: false, sortable: false, transform: t => InstrumentOperator.getType(t)}
    ];
    this.maintenanceData = new Data<InstrumentMaintenance>();
    this.maintenanceData.filters.push({key: 'InstrumentID', value: this.selectedInstrument.id});
    this.maintenanceData.sortBy = 'IMDate';
    this.maintenanceData.sortType = SortType.Desc;
    this.maintenanceTableConfig.columns = [
      {for: 'title', title: 'عنوان', dbName: 'IMTitle', hasSearch: true, sortable: true},
      {for: 'date', title: 'تاریخ', dbName: 'IMDate', hasSearch: true, sortable: true, transform: d => DateConvertor.dateStringToJalali(d)},
      {for: 'totalCost', title: 'هزینه کل اقدامات', dbName: 'IMTotalCost', hasSearch: true, sortable: true, transform: a => a + ' ریال'},
      {for: 'invoiceNo', title: 'شماره فاکتور', dbName: 'IMInvoiceNo', hasSearch: true, sortable: true}
    ];
    this.fetchMaintenance(true);
  }

  showMaintenanceDetails(item: {btnId: number, record: InstrumentMaintenance}) {
    this.selectedMaintenance = item.record;
    this.usedMaterialData.records = item.record.usedMaterialList;
    this.usedMaterialTableConfig.columns = [
      {for: 'name', dbName: '', title: 'نام قطعه/ماده', sortable: false, hasSearch: false},
      {for: 'type', dbName: '', title: 'نوع', sortable: false, hasSearch: false, transform: m => IMUsedMaterial.getType(m)},
      {for: 'price', dbName: '', title: 'قیمت هر واحد', sortable: false, hasSearch: false, transform: a => a + ' ریال'},
      {for: 'quantity', dbName: '', title: 'تعداد/مقدار', sortable: false, hasSearch: false},
      {for: 'manufacturer', dbName: '', title: 'تولید کننده', sortable: false, hasSearch: false}
    ];
    this.orgPhoneNumberData.records = item.record.servicingCompany.phoneNumbers;
    this.orgPhoneNumberTableConfig.columns = [
      {for: 'number', dbName: 'OrgPhoneNumber', title: 'شماره تلفن', sortable: false, hasSearch: false},
      {for: 'section', dbName: 'OrgPNSection', title: 'توضیحات', sortable: false, hasSearch: false}
    ];
  }

  onRemoveInstrument(index: number) {
    swal({
      title: 'حذف',
      text: `آیا از حذف "${this.instruments.records[index].name}" اطمینان دارید؟`,
      icon: 'warning',
      buttons: ['انصراف', 'تأیید'],
      dangerMode: true
    }).then(deleteConfirm => {
      if (deleteConfirm) {
        this.instrumentTableConfig.loading = true;
        this.instrumentService.delete(this.instruments.records[index].id).subscribe(res => {
          this.instrumentTableConfig.loading = false;
          swal({title: 'موفق', text: `عملیات حذف انجام شد.`, icon: 'success'});
          this.fetchInstrument();
        }, err => {
          this.instrumentTableConfig.loading = false;
          swal({title: 'ناموفق', icon: 'error'});
        });
      }
    });
  }

  onRemoveMaintenance(index: number) {
    swal({
      title: 'حذف',
      text: `آیا از حذف "${this.maintenanceData.records[index].title}" اطمینان دارید؟`,
      icon: 'warning',
      buttons: ['انصراف', 'تأیید'],
      dangerMode: true
    }).then(deleteConfirm => {
      if (deleteConfirm) {
        this.maintenanceTableConfig.loading = true;
        this.maintenanceService.delete(this.instruments.records[index].id).subscribe(res => {
          this.maintenanceTableConfig.loading = false;
          swal({title: 'موفق', text: `عملیات حذف انجام شد.`, icon: 'success'});
          this.fetchInstrument();
        }, err => {
          this.maintenanceTableConfig.loading = false;
          swal({title: 'ناموفق', icon: 'error'});
        });
      }
    });
  }

  // onToggleStatus(index: number) {
  //   this.apiService.update(this.instruments.records[index]).subscribe(res => {
  //     swal({title: 'موفق', text: `عملیات بروز رسانی با موفقیت انجام شد.`, icon: 'success'});
  //   }, err => {
  //     this.instruments.records[index].active = !this.instruments.records[index].active;
  //     swal({title: 'ناموفق', icon: 'error'});
  //   });
  // }
}
