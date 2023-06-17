import { Component } from '@angular/core';
import {Data, IMUsedMaterial} from "../../model";
import {TableConfig} from "../../data-table/table-config";
import {UsedMaterialService} from "../../services/used-material.service";
import {MatDialog} from "@angular/material/dialog";
import {UsedMaterialFormComponent} from "./used-material-form/used-material-form.component";
import swal from "sweetalert";

@Component({
  selector: 'app-used-material',
  templateUrl: './used-material.component.html',
  styleUrls: ['./used-material.component.css']
})
export class UsedMaterialComponent {
  usedMaterials: Data<IMUsedMaterial> = new Data<IMUsedMaterial>;
  table: TableConfig = new TableConfig(1);
  selectedItem: IMUsedMaterial = null;

  constructor(private apiService: UsedMaterialService,
              public dialog: MatDialog) {}

  ngOnInit() {
    this.table.buttons = null;
    this.table.buttonTitles = null;
    this.table.columns = [
      {for: 'name', dbName: 'UMName', title: 'نام', sortable: true, hasSearch: true},
      {for: 'type', dbName: 'UMType', title: 'نوع', sortable: true, hasSearch: false, transform: e => IMUsedMaterial.getType(e)},
      {for: 'manufacturer', dbName: 'UMManufacturer', title: 'تولید کننده', sortable: true, hasSearch: true},
      {for: 'price', dbName: 'UMPrice', title: 'قیمت هر واحد', sortable: true, hasSearch: true, transform: p => p + ' ریال'}
    ];

    this.fetch(true);
  }

  fetch(tableLoading:boolean = false): void {
    let options = JSON.parse(JSON.stringify(this.usedMaterials));
    options.records = [];
    this.table.loading = true;
    this.table.sorting = tableLoading;
    this.apiService.get(options).subscribe(res => {
      this.table.loading = false;
      this.table.sorting = false;
      this.usedMaterials = res;
    }, err => {
      this.table.loading = false;
      this.table.sorting = false;
      this.table.loadingFailed = true;
    });
  }

  openForm(item?: any): void {
    let data: IMUsedMaterial;
    if (item) data = item; else data = new IMUsedMaterial();

    const dialogRef = this.dialog.open(UsedMaterialFormComponent, {
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
      this.usedMaterials.filters = [];
      this.fetch();
    }

    this.table.showSearch = !this.table.showSearch;
  }

  onRemoveItem(index: number) {
    swal({
      title: 'حذف',
      text: `آیا از حذف "${this.usedMaterials.records[index].name}" اطمینان دارید؟`,
      icon: 'warning',
      buttons: ['انصراف', 'تأیید'],
      dangerMode: true
    }).then(deleteConfirm => {
      if (deleteConfirm) {
        this.table.loading = true;
        this.apiService.delete(this.usedMaterials.records[index].id).subscribe(res => {
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
