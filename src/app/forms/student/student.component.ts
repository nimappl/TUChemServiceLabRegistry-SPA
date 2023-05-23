import { Component } from '@angular/core';
import {Data, EduField, TUStudent} from "../../model";
import {TableConfig} from "../../data-table/table-config";
import {StudentService} from "../../services/student.service";
import {MatDialog} from "@angular/material/dialog";
import {StudentFormComponent} from "./student-form/student-form.component";
import swal from "sweetalert";

@Component({
  selector: 'app-student',
  templateUrl: './student.component.html',
  styleUrls: ['./student.component.css']
})
export class StudentComponent {
  students: Data<TUStudent> = new Data<TUStudent>;
  table: TableConfig = new TableConfig(1);
  selectedItem: TUStudent = null;

  constructor(private apiService: StudentService,
              public dialog: MatDialog) {}

  ngOnInit() {
    this.table.buttons = null;
    this.table.buttonTitles = null;
    this.table.columns = [
      {for: 'nationalNumber', dbName: 'PNationalNumber', title: 'کد ملی', sortable: true, hasSearch: true},
      {for: 'firstName', dbName: 'PFirstName', title: 'نام', sortable: true, hasSearch: true},
      {for: 'lastName', dbName: 'PLastName', title: 'نام خانوادگی', sortable: true, hasSearch: true},
      {for: 'stCode', dbName: 'StCode', title: 'شماره دانشجویی', sortable: true, hasSearch: true},
      {
        for: 'eduField',
        dbName: 'StEduFieldID',
        title: 'رشته تحصیلی',
        sortable: false,
        hasSearch: true,
        transform: value => TUStudent.getLevel(value.fieldLevel)
      },
    ];

    this.fetch(true);
  }

  fetch(tableLoading:boolean = false): void {
    let options = JSON.parse(JSON.stringify(this.students));
    options.records = [];
    this.table.loading = true;
    this.table.sorting = tableLoading;
    this.apiService.get(options).subscribe(res => {
      this.table.loading = false;
      this.table.sorting = false;
      this.students = res;
    }, err => {
      this.table.loading = false;
      this.table.sorting = false;
      this.table.loadingFailed = true;
    });
  }

  openForm(item?: any): void {
    let data: TUStudent;
    if (item) data = item; else data = new TUStudent();

    const dialogRef = this.dialog.open(StudentFormComponent, {
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
      this.students.filters = [];
      this.fetch();
    }

    this.table.showSearch = !this.table.showSearch;
  }

  buttonClicked(item: {btnId: number, record: TUStudent}) {
    this.selectedItem = item.record;
  }

  onRemoveItem(index: number) {
    swal({
      title: 'حذف',
      text: `آیا از حذف "${this.students.records[index].firstName} ${this.students.records[index].lastName}" اطمینان دارید؟`,
      icon: 'warning',
      buttons: ['انصراف', 'تأیید'],
      dangerMode: true
    }).then(deleteConfirm => {
      if (deleteConfirm) {
        this.table.loading = true;
        this.apiService.delete(this.students.records[index].id).subscribe(res => {
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
