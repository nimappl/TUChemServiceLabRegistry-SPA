import { Component } from '@angular/core';
import {Data, EduField, TUProfessor} from "../../model";
import {TableConfig} from "../../data-table/table-config";
import {ProfessorService} from "../../services/professor.service";
import {MatDialog} from "@angular/material/dialog";
import {ProfessorFormComponent} from "./professor-form/professor-form.component";
import swal from "sweetalert";

@Component({
  selector: 'app-professor',
  templateUrl: './professor.component.html',
  styleUrls: ['./professor.component.css']
})
export class ProfessorComponent {
  professors: Data<TUProfessor> = new Data<TUProfessor>;
  table: TableConfig = new TableConfig();
  selectedItem: TUProfessor = null;

  constructor(private apiService: ProfessorService,
              public dialog: MatDialog) {}

  ngOnInit() {
    this.table.sortable = true;
    this.table.hasDelete = true;
    this.table.hasEdit = true;
    this.table.hasActivationCol = false;
    this.table.hasSearch = true;
    this.table.columns = [
      {for: 'nationalNumber', dbName: 'PNationalNumber', title: 'کد ملی', sortable: true, hasSearch: true},
      {for: 'firstName', dbName: 'PFirstName', title: 'نام', sortable: true, hasSearch: true},
      {for: 'lastName', dbName: 'PLastName', title: 'نام خانوادگی', sortable: true, hasSearch: true},
      {
        for: 'eduGroup',
        dbName: 'ProfEduGroupId',
        title: 'گروه آموزشی',
        sortable: true,
        hasSearch: false,
        transform: value => value.name
      },
    ];

    this.fetch(true);
  }

  fetch(tableLoading:boolean = false): void {
    let options = JSON.parse(JSON.stringify(this.professors));
    options.records = [];
    this.table.loading = true;
    this.table.sorting = tableLoading;
    this.apiService.get(options).subscribe(res => {
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

    const dialogRef = this.dialog.open(ProfessorFormComponent, {
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
