import { Component } from '@angular/core';
import {Data, Payment, TPayment} from "../../model";
import {TableConfig} from "../../data-table/table-config";
import {PaymentService} from "../../services/payment.service";
import {MatDialog} from "@angular/material/dialog";
import {PaymentFormComponent} from "./payment-form/payment-form.component";
import swal from "sweetalert";
import {DateConvertor} from "../../custom-fields/jalali-date-picker/date-convertor";

@Component({
  selector: 'app-payment',
  templateUrl: './payment.component.html',
  styleUrls: ['./payment.component.css']
})
export class PaymentComponent {
  payments: Data<TPayment> = new Data<TPayment>;
  table: TableConfig = new TableConfig(1);
  selectedItem: Payment = null;

  constructor(private apiService: PaymentService,
              public dialog: MatDialog) {}

  ngOnInit() {
    this.table.columns = [
      {for: 'date', dbName: 'PmntDate', title: 'تاریخ', sortable: true, hasSearch: false, transform: d => DateConvertor.dateStringToJalali(d)},
      {for: 'amount', dbName: 'PmntAmount', title: 'مبلغ', sortable: true, hasSearch: true, transform: a => `${a} ریال`},
      {for: 'getType', dbName: 'PmntType', title: 'نوع پرداخت', sortable: true, hasSearch: false, isFunction: true},
      {for: 'customerName', dbName: 'CustomerName', title: 'نام متقاضی', sortable: true, hasSearch: true}
    ];

    this.fetch(true);
  }

  fetch(tableLoading:boolean = false): void {
    let options = JSON.parse(JSON.stringify(this.payments));
    options.records = [];
    this.table.loading = true;
    this.table.sorting = tableLoading;
    this.apiService.get(options).subscribe(res => {
      this.table.loading = false;
      this.table.sorting = false;
      this.payments = JSON.parse(JSON.stringify(res));
      this.payments.records = [];
      res.records.forEach(p =>
        this.payments.records.push(new TPayment(p))
      );
    }, err => {
      this.table.loading = false;
      this.table.sorting = false;
      this.table.loadingFailed = true;
    });
  }

  onSelectItem(item: any) {
    this.apiService.getById(item.record.id).subscribe(p => this.selectedItem = new Payment(p));
  }

  onEditItem(item: TPayment) {
    this.apiService.getById(item.id).subscribe(p => this.openForm(new Payment(p)));
  }

  openForm(item?: any): void {
    let data: Payment;
    if (item) data = item; else data = new Payment();

    const dialogRef = this.dialog.open(PaymentFormComponent, {
      width: '750px',
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
      this.payments.filters = [];
      this.fetch();
    }

    this.table.showSearch = !this.table.showSearch;
  }

  onRemoveItem(index: number) {
    swal({
      title: 'حذف',
      text: `آیا از پرداخت  "${this.payments.records[index].date}، از ${this.payments.records[index].customerName}" اطمینان دارید؟`,
      icon: 'warning',
      buttons: ['انصراف', 'تأیید'],
      dangerMode: true
    }).then(deleteConfirm => {
      if (deleteConfirm) {
        this.table.loading = true;
        this.apiService.delete(this.payments.records[index].id).subscribe(res => {
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
