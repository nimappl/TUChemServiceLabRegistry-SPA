import { Component } from '@angular/core';
import {Data, Account, VAccount} from "../../model";
import {TableConfig} from "../../data-table/table-config";
import {AccountService} from "../../services/account.service";
import swal from "sweetalert";

@Component({
  selector: 'app-customer',
  templateUrl: './customer.component.html',
  styleUrls: ['./customer.component.css']
})
export class CustomerComponent {
  customers: Data<VAccount> = new Data<VAccount>;
  table: TableConfig = new TableConfig(1);

  constructor(private apiService: AccountService) {}

  ngOnInit() {
    this.table.hasEdit = false;
    this.table.columns = [
      {for: 'customerName', dbName: 'CustomerName', title: 'نام متقاضی', sortable: true, hasSearch: true},
      {for: 'balance', dbName: 'AccountBalance', title: 'تراز', sortable: true, hasSearch: true, transform: b => b + ' ریال'},
      {for: 'getStatus', dbName: '', title: 'وضعیت حساب', sortable: true, hasSearch: false, isFunction: true}
    ];
    this.customers.pageSize = 20;
    this.fetch(true);
  }

  fetch(tableLoading:boolean = false): void {
    let options = JSON.parse(JSON.stringify(this.customers));
    options.records = [];
    this.table.loading = true;
    this.table.sorting = tableLoading;
    this.apiService.get(options).subscribe(res => {
      let pox = [];
      res.records.forEach(d => pox.push(new VAccount(d)));
      this.customers = res;
      this.customers.records = pox;
      this.table.loading = false;
      this.table.sorting = false;
    }, err => {
      this.table.loading = false;
      this.table.sorting = false;
      this.table.loadingFailed = true;
    });
  }

  showDetailsOf(item: {btnId: number, record: VAccount}) {

  }

  toggleSearch() {
    if (this.table.showSearch) {
      this.customers.filters = [];
      this.fetch();
    }

    this.table.showSearch = !this.table.showSearch;
  }

  onRemoveItem(index: number) {
    swal({
      title: 'حذف',
      text: `آیا از حذف متقاضی ${this.customers.records[index].customerName} اطمینان دارید؟`,
      icon: 'warning',
      buttons: ['انصراف', 'تأیید'],
      dangerMode: true
    }).then(deleteConfirm => {
      if (deleteConfirm) {
        this.table.loading = true;
        this.apiService.delete(this.customers.records[index].id).subscribe(res => {
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
