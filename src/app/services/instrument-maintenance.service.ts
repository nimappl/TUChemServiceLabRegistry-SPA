import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Data, InstrumentMaintenance} from "../model";
import {Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class InstrumentMaintenanceService {
  apiUrl: string = 'http://localhost:8080/instrument-maintenance';

  constructor(private http: HttpClient) {}

  get(options: Data<InstrumentMaintenance>):Observable<Data<InstrumentMaintenance>> {
    return this.http.get<Data<InstrumentMaintenance>>(`${this.apiUrl}?queryParams=${JSON.stringify(options)}`);
  }

  getById(id: number):Observable<InstrumentMaintenance> {
    return this.http.get<InstrumentMaintenance>(`${this.apiUrl}/${id}`);
  }

  create(maintenance: InstrumentMaintenance):Observable<Object> {
    return this.http.post(`${this.apiUrl}/new`, maintenance);
  }

  update(maintenance: InstrumentMaintenance):Observable<Object> {
    return this.http.put(`${this.apiUrl}/update`, maintenance);
  }

  delete(id: number):Observable<Object> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}
