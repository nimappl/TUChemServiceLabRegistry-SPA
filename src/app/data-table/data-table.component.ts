import { Component, Output, Input, EventEmitter } from '@angular/core';
import * as Model from '../model';
import { SortType } from '../model/data';
import {TableConfig} from "./table-config";

@Component({
  selector: 'app-data-table',
  templateUrl: './data-table.component.html',
  styleUrls: ['./data-table.component.css']
})
export class DataTableComponent {
  @Input() data: Model.Data<any>;
  @Input() config: TableConfig;
  @Output() editItem = new EventEmitter();
  @Output() removeItem = new EventEmitter();
  @Output() activeChanged = new EventEmitter();
  @Output() paramsChanged = new EventEmitter();
  @Output() navigateTo = new EventEmitter();
  @Output() buttonClicked = new EventEmitter();

  toggleSortFor(colIndex: number) {
    let col = this.config.columns[colIndex];
    if (col.hasSearch) {
      this.data.pageNumber = 1;
      if (this.data.sortBy !== col.dbName) {
        this.data.sortType = SortType.Asc;
        this.data.sortBy = col.dbName;
      } else {
        if (this.data.sortType === SortType.Desc) {
          this.data.sortType = SortType.Asc;
        } else if (this.data.sortType === SortType.Asc) {
          this.data.sortType = SortType.Desc;
        }
      }

      this.paramsChanged.emit();
    }
  }

  edit(index: number) {
    this.editItem.emit(this.data.records[index]);
  }

  remove(index: number) {
    this.removeItem.emit(index);
  }

  toggleActive(index: number) {
    this.activeChanged.emit(index);
  }

  search(property: string, e: any) {
    let value = e.target.value;
    this.data.pageNumber = 1;
    if (!this.data.filters) {
      this.data.filters = new Array<Model.Filter>();
      this.data.filters.push(new Model.Filter(property, value));
    } else if (this.data.filters.length === 0) {
      this.data.filters.push(new Model.Filter(property, value));
    } else {
      let filter = this.data.filters.find(f => f.key === property);
      let index = this.data.filters.indexOf(filter);

      if (!filter) {
        this.data.filters.push(new Model.Filter(property, value));
      } else {
        if (value !== '') {
          filter.value = value;
        } else {
          this.data.filters.splice(index, 1);
        }
      }
    }

    this.paramsChanged.emit();
  }

  btnClick(btnId: number, record: any) {
    this.buttonClicked.emit({btnId, record});
  }

  pagingChanged() {
    this.paramsChanged.emit();
  }
}
