import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { Data, LabPersonnel } from "../model";
import { Observable } from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class LabPersonnelService {
  apiUrl: string = 'http://localhost:8080/lab-personnel';

  constructor(private http: HttpClient) {}

  get(options: Data<LabPersonnel>):Observable<Data<LabPersonnel>> {
    return this.http.get<Data<LabPersonnel>>(`${this.apiUrl}?queryParams=${JSON.stringify(options)}`);
  }

  getById(id: number):Observable<LabPersonnel> {
    return this.http.get<LabPersonnel>(`${this.apiUrl}/${id}`);
  }

  create(person: LabPersonnel):Observable<Object> {
    return this.http.post(`${this.apiUrl}/new`, person);
  }

  update(person: LabPersonnel):Observable<Object> {
    return this.http.put(`${this.apiUrl}/update`, person);
  }

  delete(id: number):Observable<Object> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}
