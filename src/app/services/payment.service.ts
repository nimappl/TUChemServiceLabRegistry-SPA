import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Data, Payment} from "../model";
import {Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class PaymentService {
  apiUrl: string = 'http://localhost:8080/payment';

  constructor(private http: HttpClient) {}

  get(options: Data<Payment>):Observable<Data<Payment>> {
    return this.http.get<Data<Payment>>(`${this.apiUrl}?queryParams=${JSON.stringify(options)}`);
  }

  getById(id: number):Observable<Payment> {
    return this.http.get<Payment>(`${this.apiUrl}/${id}`);
  }

  create(payment: Payment):Observable<Object> {
    return this.http.post(`${this.apiUrl}/new`, payment);
  }

  update(payment: Payment):Observable<Object> {
    return this.http.put(`${this.apiUrl}/update`, payment);
  }

  delete(id: number):Observable<Object> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}
