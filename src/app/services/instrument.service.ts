import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import Instrument from '../model/instrument';
import Data from '../model/data';

@Injectable({
  providedIn: 'root'
})
export class InstrumentService {
  apiUrl: string = 'http://localhost:8080/instrument';

  constructor(private http: HttpClient) {}

  get(options: Data<Instrument>):Observable<Data<Instrument>> {
    return this.http.get<Data<Instrument>>(`${this.apiUrl}?queryParams=${JSON.stringify(options)}`);
  }

  getById(id: number):Observable<Instrument> {
    return this.http.get<Instrument>(`${this.apiUrl}/${id}`);
  }

  create(instrument: Instrument):Observable<Object> {
    return this.http.post(`${this.apiUrl}/new`, instrument);
  }

  update(instrument: Instrument):Observable<Object> {
    return this.http.put(`${this.apiUrl}/update`, instrument);
  }

  delete(id: number):Observable<Object> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}
