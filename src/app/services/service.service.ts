import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {CustomerCandidate, Data, Service, TService} from "../model";
import {Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class ServiceService {
  apiUrl: string = 'http://localhost:8080/service';

  constructor(private http: HttpClient) {}

  get(options: Data<TService>):Observable<Data<TService>> {
    return this.http.get<Data<TService>>(`${this.apiUrl}?queryParams=${JSON.stringify(options)}`);
  }

  getById(id: number):Observable<Service> {
    return this.http.get<Service>(`${this.apiUrl}/${id}`);
  }

  getCustomerCandidates(filter: string):Observable<Array<CustomerCandidate>> {
    let query: string = this.apiUrl + '/query-customer-candidates';
    if (filter && filter != '') query += '?filter=' + filter;
    return this.http.get<Array<CustomerCandidate>>(query);
  }

  create(service: Service):Observable<Object> {
    return this.http.post(`${this.apiUrl}/new`, service);
  }

  update(service: Service):Observable<Object> {
    return this.http.put(`${this.apiUrl}/update`, service);
  }

  delete(id: number):Observable<Object> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}
