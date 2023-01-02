import { Component, OnInit, Output, Input, EventEmitter } from '@angular/core';
import { Filter } from '../types/filter';
import { Data, SortType } from '../types/data';

@Component({
  selector: 'app-data-table',
  templateUrl: './data-table.component.html',
  styleUrls: ['./data-table.component.css']
})
export class DataTableComponent implements OnInit {
  @Input() data: Data<any>;
  @Input() columns: Array<{name: string, title: string}>;
  @Input() searchField: boolean;
  @Input() loading: boolean;
  @Input() sorting: boolean;
  @Input() loadingFailed: boolean;
  @Input() hasLinksField: number;
  @Input() fieldsToAvoidOnTable: string[];

  @Output() editItem = new EventEmitter();
  @Output() removeItem = new EventEmitter();
  @Output() activeChanged = new EventEmitter();
  @Output() paramsChanged = new EventEmitter();
  @Output() navigateTo = new EventEmitter();

  activeDeactive(): boolean {
    if (!this.loading && !this.loadingFailed) {
      return this.data.data.length > 0 && this.data.data[0].hasOwnProperty('active');
    } else
      return false
  }

  ngOnInit(): void {}

  openLink(id: number) {
    this.navigateTo.emit(id);
  }

  toggleSortFor(column: string) {
    if (column !== 'link') {
      this.data.pageNumber = 1;
      if (this.data.sortBy !== column) {
        this.data.sortType = SortType.Asc;
        this.data.sortBy = column;
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
    this.editItem.emit(this.data.data[index]);
  }

  remove(index: number) {
    this.removeItem.emit(index);
  }

  toggleActive(index: number) {
    this.activeChanged.emit(index);
  }

  recordFields(record: object) {
    const fields = []
    for (let field in record)
      if (!field.includes('Id') && !this.fieldsToAvoidOnTable.includes(field))
        fields.push(record[field]);

    return fields;
  }

  search(column: string, e: any) {
    let value = e.target.value;
    this.data.pageNumber = 1;
    if (!this.data.filters) {
      this.data.filters = new Array<Filter>();
      this.data.filters.push(new Filter(column, value));
    } else if (this.data.filters.length === 0) {
      this.data.filters.push(new Filter(column, value));
    } else {
      let filter = this.data.filters.find(f => f.key === column);
      let index = this.data.filters.indexOf(filter);

      if (!filter) {
        this.data.filters.push(new Filter(column, value));
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

  pagingChanged() {
    this.paramsChanged.emit();
  }
}
