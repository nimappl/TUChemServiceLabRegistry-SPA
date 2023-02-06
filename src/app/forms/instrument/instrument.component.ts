import { Component } from '@angular/core';
import * as Model from '../../model'
import { MatDialog } from "@angular/material/dialog";
import { InstrumentFormComponent } from "./instrument-form/instrument-form.component";
import { InstrumentService } from "../../services/instrument.service";
import swal from "sweetalert";
import {TableConfig} from "../../data-table/table-config";
import {Instrument} from "../../model";

@Component({
  selector: 'app-instrument',
  templateUrl: './instrument.component.html',
  styleUrls: ['./instrument.component.css']
})
export class InstrumentComponent {
  instruments: Model.Data<Model.Instrument> = new Model.Data<Model.Instrument>;
  table: TableConfig = new TableConfig();
  selectedItem: Instrument = null;

  constructor(private apiService: InstrumentService,
              public dialog: MatDialog) {}

  ngOnInit() {
    this.table.sortable = true;
    this.table.hasDelete = true;
    this.table.hasEdit = true;
    this.table.hasActivationCol = false;
    this.table.activationColTitle = 'وضعیت سرویس دهی';
    this.table.activeStatusKey = 'serviceable';
    this.table.hasSearch = true;
    this.table.columns = [
      {for: 'name', dbName: 'IName', title: 'نام دستگاه', sortable: true, hasSearch: true},
      {for: 'model', dbName: 'IModel', title: 'مدل', sortable: true, hasSearch: true},
      // {for: 'serial', dbName: 'ISerialNo', title: 'شماره سریال', sortable: true, hasSearch: true},
      {for: 'manufacturer', dbName: 'IManufacturer', title: 'شرکت سازنده', sortable: true, hasSearch: true},
      {for: 'madeIn', dbName: 'IMadeIn', title: 'کشور سازنده', sortable: true, hasSearch: true},
      {
        for: 'serviceable',
        dbName: 'IServiceable',
        title: 'وضعیت سرویس دهی',
        sortable: false,
        hasSearch: false,
        transform: (item) => item == 1 ? 'آماده سرویس دهی' : 'غیرقابل استفاده'
      }
    ];
    this.table.buttonTitles = ['جزئیات'];
    this.table.buttons = [{title: 'مشاهده جزئیات', id: 1, altText: ''}];

    this.fetch(true);
  }

  fetch(tableLoading:boolean = false): void {
    let options = JSON.parse(JSON.stringify(this.instruments));
    options.records = [];
    this.table.loading = true;
    this.table.sorting = tableLoading;
    this.apiService.get(options).subscribe(res => {
      this.table.loading = false;
      this.table.sorting = false;
      this.instruments = res;
    }, err => {
      this.table.loading = false;
      this.table.sorting = false;
      this.table.loadingFailed = true;
    });
  }

  openForm(item?: any): void {
    let data: Model.Instrument;
    if (item) data = item; else data = new Model.Instrument();

    const dialogRef = this.dialog.open(InstrumentFormComponent, {
      width: '850px',
      direction: 'rtl',
      disableClose: true,
      data: data
    });

    dialogRef.afterClosed().subscribe(submitted => {
      if(submitted) this.fetch(true);
    });
  }

  toggleSearch() {
    if (this.table.showSearch) {
      this.instruments.filters = [];
      this.fetch();
    }

    this.table.showSearch = !this.table.showSearch;
  }

  buttonClicked(item: {btnId: number, record: Instrument}) {
    this.selectedItem = item.record;
  }

  onRemoveItem(index: number) {
    swal({
      title: 'حذف',
      text: `آیا از حذف "${this.instruments.records[index].name}" اطمینان دارید؟`,
      icon: 'warning',
      buttons: ['انصراف', 'تأیید'],
      dangerMode: true
    }).then(deleteConfirm => {
      if (deleteConfirm) {
        this.table.loading = true;
        this.apiService.delete(this.instruments.records[index].id).subscribe(res => {
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

  // onToggleStatus(index: number) {
  //   this.apiService.update(this.instruments.records[index]).subscribe(res => {
  //     swal({title: 'موفق', text: `عملیات بروز رسانی با موفقیت انجام شد.`, icon: 'success'});
  //   }, err => {
  //     this.instruments.records[index].active = !this.instruments.records[index].active;
  //     swal({title: 'ناموفق', icon: 'error'});
  //   });
  // }
}
