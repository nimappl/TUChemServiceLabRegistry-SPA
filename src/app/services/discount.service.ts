import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Data, Discount} from "../model";
import {Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class DiscountService {
  apiUrl: string = 'http://localhost:8080/discount';

  constructor(private http: HttpClient) {}

  get(options: Data<Discount>):Observable<Data<Discount>> {
    return this.http.get<Data<Discount>>(`${this.apiUrl}?queryParams=${JSON.stringify(options)}`);
  }

  getForTest(testId: number, dNameFilter: string): Observable<Array<Discount>> {
    return this.http.get<Array<Discount>>(`${this.apiUrl}/for-test/${testId}/${dNameFilter}`);
  }

  getById(id: number):Observable<Discount> {
    return this.http.get<Discount>(`${this.apiUrl}/${id}`);
  }

  create(discount: Discount):Observable<Object> {
    return this.http.post(`${this.apiUrl}/new`, discount);
  }

  update(discount: Discount):Observable<Object> {
    return this.http.put(`${this.apiUrl}/update`, discount);
  }

  delete(id: number):Observable<Object> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}
