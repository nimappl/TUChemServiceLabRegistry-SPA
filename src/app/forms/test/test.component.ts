import { Component } from '@angular/core';
import {Data, Discount, Test, TestFee, TestPrep} from "../../model";
import {TableConfig} from "../../data-table/table-config";
import {TestService} from "../../services/test.service";
import {MatDialog} from "@angular/material/dialog";
import {TestFormComponent} from "./test-form/test-form.component";
import swal from "sweetalert";
import {DateConvertor} from "../../custom-fields/jalali-date-picker/date-convertor";
import {ScrollStrategyOptions} from "@angular/cdk/overlay";

@Component({
  selector: 'app-test',
  templateUrl: './test.component.html',
  styleUrls: ['./test.component.css']
})
export class TestComponent {
  tests: Data<Test> = new Data<Test>;
  table: TableConfig = new TableConfig(1);
  testFeesTable: TableConfig = new TableConfig(0);
  testSamplePrepsTable: TableConfig = new TableConfig(0);
  testDiscountsTable: TableConfig = new TableConfig(0);
  testFeesData: Data<TestFee> = new Data<TestFee>();
  testSamplePrepsData: Data<TestPrep> = new Data<TestPrep>();
  testDiscountsData: Data<Discount> = new Data<Discount>();
  selectedItem: Test = null;

  constructor(private apiService: TestService,
              public dialog: MatDialog) {}

  ngOnInit() {
    this.table.columns = [
      {for: 'name', dbName: 'TName', title: 'نام آزمون', sortable: true, hasSearch: true},
      {for: 'description', dbName: 'TDescription', title: 'توضیح', sortable: true, hasSearch: true},
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

  toggleSearch() {
    if (this.table.showSearch) {
      this.tests.filters = [];
      this.fetch();
    }

    this.table.showSearch = !this.table.showSearch;
  }

  formatDescription(val:string):string {
    return val.replace(/(\r\n|\r|\n)/g, '<br>');
  }

  buttonClicked(item: {btnId: number, record: Test}) {
    this.selectedItem = item.record;
    this.testFeesData.records = this.selectedItem.fees;
    this.testSamplePrepsData.records = this.selectedItem.samplePreparations;
    this.testDiscountsData.records = this.selectedItem.discounts;

    this.testFeesTable.columns = [
      {for: 'type', dbName: 'TFBase', title: 'مبنای تعرفه', sortable: false, hasSearch: false, transform: value => TestFee.getType(value)},
      {for: 'step', dbName: 'TFStep', title: 'گام افزایش تعرفه', sortable: false, hasSearch: false},
      {for: 'amount', dbName: 'TFAmount', title: 'مبلغ', sortable: false, hasSearch: false},
      {for: 'date', dbName: 'TFDate', title: 'تاریخ ایجاد', sortable: false, hasSearch: false, transform: value => DateConvertor.dateStringToJalali(value)}
    ];
    this.testSamplePrepsTable.columns = [
      {for: 'type', dbName: 'TPrepType', title: 'عنوان', sortable: false, hasSearch: false},
      {for: 'price', dbName: 'TPrepPrice', title: 'هزینه', sortable: false, hasSearch: false}
    ];
    this.testDiscountsTable.columns = [
      {for: 'type', dbName: 'TDType', title: 'عنوان', sortable: false, hasSearch: false, transform: value => Discount.getType(value)},
      {for: 'minSamples', dbName: 'TDMinSamples', title: 'حداقل تعداد نمونه', sortable: false, hasSearch: false},
      {for: 'percent', dbName: 'TDPercent', title: 'درصد', sortable: false, hasSearch: false}
    ];
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
