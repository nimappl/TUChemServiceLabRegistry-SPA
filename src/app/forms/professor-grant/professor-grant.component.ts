import { Component } from '@angular/core';
import {Data, TUProfessor} from "../../model";
import {TableConfig} from "../../data-table/table-config";
import {ProfessorService} from "../../services/professor.service";
import {MatDialog} from "@angular/material/dialog";
import swal from "sweetalert";
import {DateConvertor} from "../../custom-fields/jalali-date-picker/date-convertor";
import {ProfessorGrantFormComponent} from "./professor-grant-form/professor-grant-form.component";

@Component({
  selector: 'app-professor-grant',
  templateUrl: './professor-grant.component.html',
  styleUrls: ['./professor-grant.component.css']
})
export class ProfessorGrantComponent {
  professors: Data<TUProfessor> = new Data<TUProfessor>;
  table: TableConfig = new TableConfig(1);
  selectedItem: TUProfessor = null;

  constructor(private apiService: ProfessorService,
              public dialog: MatDialog) {}

  ngOnInit() {
    this.table.buttons = null;
    this.table.buttonTitles = null;
    this.table.columns = [
      {for: 'firstName', dbName: 'PFirstName', title: 'نام استاد', sortable: true, hasSearch: true},
      {for: 'lastName', dbName: 'PLastName', title: 'نام خانوادگی استاد', sortable: true, hasSearch: true},
      {
        for: 'grantIssueDate',
        dbName: 'ProfGrantIssueDate',
        title: 'تاریخ تخصیص',
        sortable: false,
        hasSearch: false,
        transform: value => DateConvertor.dateStringToJalali(value)
      },
      {for: 'grantAmount', dbName: 'ProfGrantAmount', title: 'مبلغ', sortable: true, hasSearch: true},
      {
        for: 'grantCredibleUntil',
        dbName: 'ProfGrantCredibleUntil',
        title: 'تاریخ انقضا',
        sortable: false,
        hasSearch: false,
        transform: value => DateConvertor.dateStringToJalali(value)
      },
    ];

    this.fetch(true);
  }

  fetch(tableLoading:boolean = false): void {
    let options = JSON.parse(JSON.stringify(this.professors));
    options.records = [];
    this.table.loading = true;
    this.table.sorting = tableLoading;
    this.apiService.getGrantList(options).subscribe(res => {
      this.table.loading = false;
      this.table.sorting = false;
      this.professors = res;
    }, err => {
      this.table.loading = false;
      this.table.sorting = false;
      this.table.loadingFailed = true;
    });
  }

  openForm(item?: any): void {
    let data: TUProfessor;
    if (item) data = item; else data = new TUProfessor();

    const dialogRef = this.dialog.open(ProfessorGrantFormComponent, {
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
      this.professors.filters = [];
      this.fetch();
    }

    this.table.showSearch = !this.table.showSearch;
  }

  buttonClicked(item: {btnId: number, record: TUProfessor}) {
    this.selectedItem = item.record;
  }

  onRemoveItem(index: number) {
    swal({
      title: 'حذف',
      text: `آیا از حذف "${this.professors.records[index].firstName} ${this.professors.records[index].lastName}" اطمینان دارید؟`,
      icon: 'warning',
      buttons: ['انصراف', 'تأیید'],
      dangerMode: true
    }).then(deleteConfirm => {
      if (deleteConfirm) {
        this.table.loading = true;
        this.apiService.delete(this.professors.records[index].id).subscribe(res => {
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
