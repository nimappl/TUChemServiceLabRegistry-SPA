import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { Data, EduField } from "../model";
import { Observable } from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class EduFieldService {
  apiUrl: string = 'http://localhost:8080/edu-field';

  constructor(private http: HttpClient) {}

  get(options: Data<EduField>):Observable<Data<EduField>> {
    return this.http.get<Data<EduField>>(`${this.apiUrl}?queryParams=${JSON.stringify(options)}`);
  }

  getById(id: number):Observable<EduField> {
    return this.http.get<EduField>(`${this.apiUrl}/${id}`);
  }

  create(eduField: EduField):Observable<Object> {
    return this.http.post(`${this.apiUrl}/new`, eduField);
  }

  update(eduField: EduField):Observable<Object> {
    return this.http.put(`${this.apiUrl}/update`, eduField);
  }

  delete(id: number):Observable<Object> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}
