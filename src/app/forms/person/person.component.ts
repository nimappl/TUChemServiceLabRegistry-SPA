import { Component } from '@angular/core';
import {TableConfig} from "../../data-table/table-config";
import { PersonService } from "../../services/person.service";
import {MatDialog} from "@angular/material/dialog";
import { PersonFormComponent } from "./person-form/person-form.component";
import swal from "sweetalert";
import { Data, Person } from "../../model";

@Component({
  selector: 'app-person',
  templateUrl: './person.component.html',
  styleUrls: ['./person.component.css']
})
export class PersonComponent {
  persons: Data<Person> = new Data<Person>;
  table: TableConfig = new TableConfig();
  selectedItem: Person = null;

  constructor(private apiService: PersonService,
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
      {for: 'phoneNumber', dbName: 'PPhoneNumber', title: 'تلفن تماس', sortable: true, hasSearch: true}
    ];

    this.fetch(true);
  }

  fetch(tableLoading:boolean = false): void {
    let options = JSON.parse(JSON.stringify(this.persons));
    options.records = [];
    this.table.loading = true;
    this.table.sorting = tableLoading;
    this.apiService.get(options).subscribe(res => {
      this.table.loading = false;
      this.table.sorting = false;
      this.persons = res;
    }, err => {
      this.table.loading = false;
      this.table.sorting = false;
      this.table.loadingFailed = true;
    });
  }

  openForm(item?: any): void {
    let data: Person;
    if (item) data = item; else data = new Person();

    const dialogRef = this.dialog.open(PersonFormComponent, {
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
      this.persons.filters = [];
      this.fetch();
    }

    this.table.showSearch = !this.table.showSearch;
  }

  buttonClicked(item: {btnId: number, record: Person}) {
    this.selectedItem = item.record;
  }

  onRemoveItem(index: number) {
    swal({
      title: 'حذف',
      text: `آیا از حذف "${this.persons.records[index].firstName} ${this.persons.records[index].lastName}" اطمینان دارید؟`,
      icon: 'warning',
      buttons: ['انصراف', 'تأیید'],
      dangerMode: true
    }).then(deleteConfirm => {
      if (deleteConfirm) {
        this.table.loading = true;
        this.apiService.delete(this.persons.records[index].id).subscribe(res => {
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
