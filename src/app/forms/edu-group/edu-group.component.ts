import { Component } from '@angular/core';
import { Data, EduGroup } from "../../model";
import { TableConfig } from "../../data-table/table-config";
import { MatDialog } from "@angular/material/dialog";
import swal from "sweetalert";
import { EduGroupService } from "../../services/edu-group.service";
import { EduGroupFormComponent } from "./edu-group-form/edu-group-form.component";

@Component({
  selector: 'app-edu-group',
  templateUrl: './edu-group.component.html',
  styleUrls: ['./edu-group.component.css']
})
export class EduGroupComponent {
  eduGroups: Data<EduGroup> = new Data<EduGroup>;
  table: TableConfig = new TableConfig();
  selectedItem: EduGroup = null;

  constructor(private apiService: EduGroupService,
              public dialog: MatDialog) {}

  ngOnInit() {
    this.table.sortable = true;
    this.table.hasDelete = true;
    this.table.hasEdit = true;
    this.table.hasActivationCol = false;
    this.table.hasSearch = true;
    this.table.columns = [
      {for: 'name', dbName: 'EduGroupName', title: 'نام گروه آموزشی', sortable: true, hasSearch: true},
    ];

    this.fetch(true);
  }

  fetch(tableLoading:boolean = false): void {
    let options = JSON.parse(JSON.stringify(this.eduGroups));
    options.records = [];
    this.table.loading = true;
    this.table.sorting = tableLoading;
    this.apiService.get(options).subscribe(res => {
      this.table.loading = false;
      this.table.sorting = false;
      this.eduGroups = res;
    }, err => {
      this.table.loading = false;
      this.table.sorting = false;
      this.table.loadingFailed = true;
    });
  }

  openForm(item?: any): void {
    let data: EduGroup;
    if (item) data = item; else data = new EduGroup();

    const dialogRef = this.dialog.open(EduGroupFormComponent, {
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
      this.eduGroups.filters = [];
      this.fetch();
    }

    this.table.showSearch = !this.table.showSearch;
  }

  onRemoveItem(index: number) {
    swal({
      title: 'حذف',
      text: `آیا از حذف گروه "${this.eduGroups.records[index].name}" اطمینان دارید؟`,
      icon: 'warning',
      buttons: ['انصراف', 'تأیید'],
      dangerMode: true
    }).then(deleteConfirm => {
      if (deleteConfirm) {
        this.table.loading = true;
        this.apiService.delete(this.eduGroups.records[index].id).subscribe(res => {
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
