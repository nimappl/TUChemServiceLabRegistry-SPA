import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { default as Data } from 'src/app/model/data';

@Component({
  selector: 'app-pagination',
  templateUrl: './pagination.component.html',
  styleUrls: ['./pagination.component.css']
})
export class PaginationComponent implements OnInit, OnChanges {

  @Input() pagingParams: Data<any>;
  @Output() pagingChanged = new EventEmitter();
  numberOfPages: number;
  pages = [];
  lastItemInPage: number;
  pageSizes = [5, 10, 20];

  ngOnInit(): void {
    this.calculate();
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.calculate();
  }

  calculate() {
    let pageNum = 1;
    let pages = [];
    for (let i = 0; i < this.pagingParams.count; i+=this.pagingParams.pageSize)
      pages.push(pageNum++);

    this.pages = pages;

    this.numberOfPages = this.pages.length;
    this.lastItemInPage = 0;
    let items = this.pagingParams.pageNumber * this.pagingParams.pageSize
    if (items > this.pagingParams.count)
      this.lastItemInPage = this.pagingParams.count;
    else
      this.lastItemInPage = items;
  }

  pageSizeChanged() {
    this.pagingParams.pageNumber = 1;
    this.calculate();
    this.pagingChanged.emit();
  }

  pageNumberChange(no: number) {
    if (no === 0) {
      this.pagingParams.pageNumber++;
    } else if (no === -1) {
      this.pagingParams.pageNumber--;
    } else {
      this.pagingParams.pageNumber = no;
    }
    this.calculate();
    this.pagingChanged.emit();
  }

}
