import {Component} from '@angular/core';
import {Data, SortType} from "../../types/data";

@Component({
  selector: 'app-instrument',
  templateUrl: './instrument.component.html',
  styleUrls: ['./instrument.component.css']
})
export class InstrumentComponent {
  instruments: Data<{id: string, name: string, model: string, make: string}> =
      new Data<{id: string, name: string, model: string, make: string}>;
  columns: {name: string, title: string}[];
  loading: boolean = false;
  ngOnInit() {
    this.instruments.data = [
        {id: 'lsdrf82349fnw', name: "GC-MS", model: "Agilent", make: 'Bruker'},
        {id: 'lsdrf82349fnw', name: "GC-MS", model: "Agilent", make: 'Bruker'},
        {id: 'lsdrf82349fnw', name: "GC-MS", model: "Agilent", make: 'Bruker'},
        {id: 'lsdrf82349fnw', name: "GC-MS", model: "Agilent", make: 'Bruker'},
      ];
    this.instruments.pageSize = 5;
    this.instruments.pageNumber = 2;
    this.instruments.count = 8;
    this.columns = [
      {name: 'name', title: 'نام'},
      {name: 'model', title: 'مدل'},
      {name: 'make', title: 'سازنده'}
    ];
  }

  openModal() {
    this.loading = !this.loading;
  }
  toggleSearch() {

  }
}
