import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Data, Test} from "../model";
import {Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class TestService {
  apiUrl: string = 'http://localhost:8080/test';

  constructor(private http: HttpClient) {}

  get(options: Data<Test>):Observable<Data<Test>> {
    return this.http.get<Data<Test>>(`${this.apiUrl}?queryParams=${JSON.stringify(options)}`);
  }

  getById(id: number):Observable<Test> {
    return this.http.get<Test>(`${this.apiUrl}/${id}`);
  }

  create(test: Test):Observable<Object> {
    return this.http.post(`${this.apiUrl}/new`, test);
  }

  toggleStatus(testId: number, status: number):Observable<Object> {
    return this.http.post(`${this.apiUrl}/status`, {testId: testId, status: status});
  }

  update(test: Test):Observable<Object> {
    return this.http.put(`${this.apiUrl}/update`, test);
  }

  delete(id: number):Observable<Object> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}
