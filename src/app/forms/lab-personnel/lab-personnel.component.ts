import { Component } from '@angular/core';
import { Data, LabPersonnel } from "../../model";
import { TableConfig } from "../../data-table/table-config";
import { LabPersonnelService } from "../../services/lab-personnel.service";
import { MatDialog } from "@angular/material/dialog";
import { LabPersonnelFormComponent } from "./lab-personnel-form/lab-personnel-form.component";
import swal from "sweetalert";

@Component({
  selector: 'app-lab-personnel',
  templateUrl: './lab-personnel.component.html',
  styleUrls: ['./lab-personnel.component.css']
})
export class LabPersonnelComponent {
  personnelList: Data<LabPersonnel> = new Data<LabPersonnel>;
  table: TableConfig = new TableConfig();
  selectedItem: LabPersonnel = null;

  constructor(private apiService: LabPersonnelService,
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
      {for: 'personnelCode', dbName: 'LPCode', title: 'کد پرسنلی', sortable: true, hasSearch: true},
      {for: 'post', dbName: 'LPPost', title: 'سمت', sortable: true, hasSearch: true},
    ];

    this.fetch(true);
  }

  fetch(tableLoading:boolean = false): void {
    let options = JSON.parse(JSON.stringify(this.personnelList));
    options.records = [];
    this.table.loading = true;
    this.table.sorting = tableLoading;
    this.apiService.get(options).subscribe(res => {
      this.table.loading = false;
      this.table.sorting = false;
      this.personnelList = res;
    }, err => {
      this.table.loading = false;
      this.table.sorting = false;
      this.table.loadingFailed = true;
    });
  }

  openForm(item?: any): void {
    let data: LabPersonnel;
    if (item) data = item; else data = new LabPersonnel();

    const dialogRef = this.dialog.open(LabPersonnelFormComponent, {
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
      this.personnelList.filters = [];
      this.fetch();
    }

    this.table.showSearch = !this.table.showSearch;
  }

  buttonClicked(item: {btnId: number, record: LabPersonnel}) {
    this.selectedItem = item.record;
  }

  onRemoveItem(index: number) {
    swal({
      title: 'حذف',
      text: `آیا از حذف "${this.personnelList.records[index].firstName} ${this.personnelList.records[index].lastName}" اطمینان دارید؟`,
      icon: 'warning',
      buttons: ['انصراف', 'تأیید'],
      dangerMode: true
    }).then(deleteConfirm => {
      if (deleteConfirm) {
        this.table.loading = true;
        this.apiService.delete(this.personnelList.records[index].id).subscribe(res => {
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
