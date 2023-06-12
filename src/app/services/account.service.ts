import { Injectable } from '@angular/core';
import {Data, Account} from "../model";
import {Observable} from "rxjs";
import {HttpClient} from "@angular/common/http";

@Injectable({
  providedIn: 'root'
})
export class AccountService {
  apiUrl: string = 'http://localhost:8080/account';

  constructor(private http: HttpClient) {}

  get(options: Data<Account>):Observable<Data<Account>> {
    return this.http.get<Data<Account>>(`${this.apiUrl}?queryParams=${JSON.stringify(options)}`);
  }

  getById(id: number):Observable<Account> {
    return this.http.get<Account>(`${this.apiUrl}/${id}`);
  }

  exists(id: number, type: number):Observable<Account> {
    return this.http.get<Account>(`${this.apiUrl}/exists/${id}/${type}`);
  }

  create(account: Account):Observable<Object> {
    return this.http.post(`${this.apiUrl}/new`, account);
  }

  update(account: Account):Observable<Object> {
    return this.http.put(`${this.apiUrl}/update`, account);
  }

  delete(id: number):Observable<Object> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}
