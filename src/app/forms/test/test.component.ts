import { Component } from '@angular/core';
import {Data, Test} from "../../model";
import {TableConfig} from "../../data-table/table-config";
import {TestService} from "../../services/test.service";
import {MatDialog} from "@angular/material/dialog";
import {TestFormComponent} from "./test-form/test-form.component";
import swal from "sweetalert";

@Component({
  selector: 'app-test',
  templateUrl: './test.component.html',
  styleUrls: ['./test.component.css']
})
export class TestComponent {
  tests: Data<Test> = new Data<Test>;
  table: TableConfig = new TableConfig();
  selectedItem: Test = null;

  constructor(private apiService: TestService,
              public dialog: MatDialog) {}

  ngOnInit() {
    this.table.sortable = true;
    this.table.hasDelete = true;
    this.table.hasEdit = true;
    this.table.hasActivationCol = true;
    this.table.activeStatusKey = 'tActive';
    this.table.hasSearch = true;
    this.table.columns = [
      {for: 'name', dbName: 'TName', title: 'نام آزمون', sortable: true, hasSearch: true},
      {for: 'description', dbName: 'TDescription', title: 'توضیح', sortable: true, hasSearch: true},
      /* {for: 'fee', dbName: 'PLastName', title: 'تعرفه', sortable: false, hasSearch: false}, */
    ];
    this.table.buttonTitles = ['جزئیات'];
    this.table.buttons = [{title: 'مشاهده جزئیات', id: 1, altText: ''}];

    this.fetch(true);
  }

  fetch(tableLoading:boolean = false): void {
    let options = JSON.parse(JSON.stringify(this.tests));
    options.records = [];
    this.table.loading = true;
    this.table.sorting = tableLoading;
    this.apiService.get(options).subscribe(res => {
      this.table.loading = false;
      this.table.sorting = false;
      this.tests = res;
    }, err => {
      this.table.loading = false;
      this.table.sorting = false;
      this.table.loadingFailed = true;
    });
  }

  openForm(item?: any): void {
    let data: Test;
    if (item) data = item; else data = new Test();

    const dialogRef = this.dialog.open(TestFormComponent, {
      width: '900px',
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
      this.tests.filters = [];
      this.fetch();
    }

    this.table.showSearch = !this.table.showSearch;
  }

  buttonClicked(item: {btnId: number, record: Test}) {
    this.selectedItem = item.record;
  }

  onRemoveItem(index: number) {
    swal({
      title: 'حذف',
      text: `آیا از حذف آزمون "${this.tests.records[index].shortName}" اطمینان دارید؟`,
      icon: 'warning',
      buttons: ['انصراف', 'تأیید'],
      dangerMode: true
    }).then(deleteConfirm => {
      if (deleteConfirm) {
        this.table.loading = true;
        this.apiService.delete(this.tests.records[index].id).subscribe(res => {
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

  onToggleStatus(index: number) {
    this.tests.records[index].tActive = Number(this.tests.records[index].tActive);
    this.apiService.toggleStatus(this.tests.records[index].id, this.tests.records[index].tActive).subscribe(res => {
      swal({title: 'موفق', text: `عملیات بروز رسانی با موفقیت انجام شد.`, icon: 'success'});
    }, err => {
      this.tests.records[index].tActive = !this.tests.records[index].tActive;
      swal({title: 'ناموفق', icon: 'error'});
    });
  }
}
