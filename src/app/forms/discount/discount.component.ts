import { Component } from '@angular/core';
import {Data, Discount} from "../../model";
import {TableConfig} from "../../data-table/table-config";
import {DiscountService} from "../../services/discount.service";
import {MatDialog} from "@angular/material/dialog";
import {DiscountFormComponent} from "./discount-form/discount-form.component";
import swal from "sweetalert";

@Component({
  selector: 'app-discount',
  templateUrl: './discount.component.html',
  styleUrls: ['./discount.component.css']
})
export class DiscountComponent {
  discounts: Data<Discount> = new Data<Discount>;
  table: TableConfig = new TableConfig(1);

  constructor(private apiService: DiscountService,
              public dialog: MatDialog) {}

  ngOnInit() {
    this.table.buttons = null;
    this.table.buttonTitles = null;
    this.table.columns = [
      {for: 'getType', dbName: 'TDType', title: 'عنوان تخفیف', sortable: true, hasSearch: false, isFunction: true},
      {for: 'percent', dbName: 'TDPercent', title: 'درصد', sortable: true, hasSearch: true}
    ];

    this.fetch(true);
  }

  fetch(tableLoading:boolean = false): void {
    let options = JSON.parse(JSON.stringify(this.discounts));
    options.records = [];
    this.table.loading = true;
    this.table.sorting = tableLoading;
    this.apiService.get(options).subscribe(res => {
      let pox = [];
      res.records.forEach(d => pox.push(new Discount(d)));
      this.discounts = res;
      this.discounts.records = pox;
      this.table.loading = false;
      this.table.sorting = false;
    }, err => {
      this.table.loading = false;
      this.table.sorting = false;
      this.table.loadingFailed = true;
    });
  }

  openForm(item?: any): void {
    let data: Discount;
    if (item) data = item; else data = new Discount();

    const dialogRef = this.dialog.open(DiscountFormComponent, {
      width: '850px',
      direction: 'rtl',
      disableClose: true,
      data: data
    });

    dialogRef.afterClosed().subscribe(submitted => {
      if(submitted) this.fetch(true);
    });
  }

  onRemoveItem(index: number) {
    swal({
      title: 'حذف',
      text: `آیا از حذف تخفیف انتخاب شده اطمینان دارید؟`,
      icon: 'warning',
      buttons: ['انصراف', 'تأیید'],
      dangerMode: true
    }).then(deleteConfirm => {
      if (deleteConfirm) {
        this.table.loading = true;
        this.apiService.delete(this.discounts.records[index].id).subscribe(res => {
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
