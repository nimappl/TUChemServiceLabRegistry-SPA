import { Component } from '@angular/core';
import * as Model from '../../model'
import { MatDialog } from "@angular/material/dialog";
import { InstrumentFormComponent } from "./instrument-form/instrument-form.component";
import { InstrumentService } from "../../services/instrument.service";
import swal from "sweetalert";

@Component({
  selector: 'app-instrument',
  templateUrl: './instrument.component.html',
  styleUrls: ['./instrument.component.css']
})
export class InstrumentComponent {
  instruments: Model.Data<Model.Instrument> = new Model.Data<Model.Instrument>;
  columns = [
    {name: 'name', title: 'نام'},
    {name: 'model', title: 'مدل'},
    {name: 'serial', title: 'شماره سریال'},
    {name: 'manufacturer', title: 'شرکت سازنده'},
    {name: 'madeIn', title: 'کشور سازنده'},
  ];
  fieldsNotToShow = ['instrumentId', 'active'];
  showSearchField = false;
  loading = false;
  sorting = false;
  loadingFailed = false;
  searchFormStatus = 'clean';
  activeDeactive: boolean = false;

  constructor(private apiService: InstrumentService,
              public dialog: MatDialog) {}
  ngOnInit() {
    this.fetch(true);
  }

  fetch(tableLoading:boolean = false): void {
    console.log(this.instruments);
    let options = JSON.parse(JSON.stringify(this.instruments));
    options.data = [];
    this.loading = true;
    this.sorting = tableLoading;
    this.apiService.get(options).subscribe(res => {
      this.loading = false;
      this.sorting = false;
      this.instruments = res;
      console.log(this.instruments)
    }, err => {
      this.loading = false;
      this.sorting = false;
      this.loadingFailed = true;
    });
  }

  openForm(edit?: any): void {
    let data: Model.Instrument;
    if (edit) data = edit; else data = new Model.Instrument();

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
    this.showSearchField = !this.showSearchField;
    this.apiService.getById(12).subscribe(res => {
      console.log(res);
    }, err => {
      console.log(err);
    });
  }

  paramsChanged() {
    this.fetch();
  }

  onRemoveItem(index: number) {
    swal({
      title: 'حذف',
      text: `آیا از حذف "${this.instruments.data[index].name}" اطمینان دارید؟`,
      icon: 'warning',
      buttons: ['انصراف', 'تأیید'],
      dangerMode: true
    }).then(deleteConfirm => {
      if (deleteConfirm) {
        this.loading = true;
        this.apiService.delete(this.instruments.data[index].instrumentId).subscribe(res => {
          this.loading = false;
          swal({title: 'موفق', text: `عملیات حذف انجام شد.`, icon: 'success'});
          this.fetch();
        }, err => {
          this.loading = false;
          swal({title: 'ناموفق', icon: 'error'});
        });
      }
    });
  }

  onToggleStatus(index: number) {
    this.apiService.update(this.instruments.data[index]).subscribe(res => {
      swal({title: 'موفق', text: `عملیات بروز رسانی با موفقیت انجام شد.`, icon: 'success'});
    }, err => {
      this.instruments.data[index].active = !this.instruments.data[index].active;
      swal({title: 'ناموفق', icon: 'error'});
    });
  }
}
