import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { Data, TUStudent } from "../model";
import { Observable } from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class StudentService {
  apiUrl: string = 'http://localhost:8080/student';

  constructor(private http: HttpClient) {}

  get(options: Data<TUStudent>):Observable<Data<TUStudent>> {
    return this.http.get<Data<TUStudent>>(`${this.apiUrl}?queryParams=${JSON.stringify(options)}`);
  }

  getById(id: number):Observable<TUStudent> {
    return this.http.get<TUStudent>(`${this.apiUrl}/${id}`);
  }

  create(student: TUStudent):Observable<Object> {
    return this.http.post(`${this.apiUrl}/new`, student);
  }

  update(student: TUStudent):Observable<Object> {
    return this.http.put(`${this.apiUrl}/update`, student);
  }

  delete(id: number):Observable<Object> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}
