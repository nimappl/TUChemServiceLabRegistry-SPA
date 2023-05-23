import { Component } from '@angular/core';
import { Data, EduField } from "../../model";
import { TableConfig } from "../../data-table/table-config";
import { EduFieldService } from "../../services/edu-field.service";
import { MatDialog } from "@angular/material/dialog";
import { EduFieldFormComponent } from "./edu-field-form/edu-field-form.component";
import swal from "sweetalert";

@Component({
  selector: 'app-edu-field',
  templateUrl: './edu-field.component.html',
  styleUrls: ['./edu-field.component.css']
})
export class EduFieldComponent {
  eduFields: Data<EduField> = new Data<EduField>;
  table: TableConfig = new TableConfig(1);
  selectedItem: EduField = null;

  constructor(private apiService: EduFieldService,
              public dialog: MatDialog) {}

  ngOnInit() {
    this.table.buttons = null;
    this.table.buttonTitles = null;
    this.table.columns = [
      {for: 'name', dbName: 'EduFieldName', title: 'نام رشته تحصیلی', sortable: true, hasSearch: true},
      {for: 'eduGroup', dbName: 'EduGroupID', title: 'گروه آموزشی', sortable: true, hasSearch: false, transform: eg => eg.name}
    ];

    this.fetch(true);
  }

  fetch(tableLoading:boolean = false): void {
    let options = JSON.parse(JSON.stringify(this.eduFields));
    options.records = [];
    this.table.loading = true;
    this.table.sorting = tableLoading;
    this.apiService.get(options).subscribe(res => {
      this.table.loading = false;
      this.table.sorting = false;
      this.eduFields = res;
    }, err => {
      this.table.loading = false;
      this.table.sorting = false;
      this.table.loadingFailed = true;
    });
  }

  openForm(item?: any): void {
    let data: EduField;
    if (item) data = item; else data = new EduField();

    const dialogRef = this.dialog.open(EduFieldFormComponent, {
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
      this.eduFields.filters = [];
      this.fetch();
    }

    this.table.showSearch = !this.table.showSearch;
  }

  onRemoveItem(index: number) {
    swal({
      title: 'حذف',
      text: `آیا از حذف رشته "${this.eduFields.records[index].name}" اطمینان دارید؟`,
      icon: 'warning',
      buttons: ['انصراف', 'تأیید'],
      dangerMode: true
    }).then(deleteConfirm => {
      if (deleteConfirm) {
        this.table.loading = true;
        this.apiService.delete(this.eduFields.records[index].id).subscribe(res => {
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
