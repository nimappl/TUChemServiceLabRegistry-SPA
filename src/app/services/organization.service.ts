import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Data, Organization} from "../model";
import {Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class OrganizationService {
  apiUrl: string = 'http://localhost:8080/organization';

  constructor(private http: HttpClient) {}

  get(options: Data<Organization>):Observable<Data<Organization>> {
    return this.http.get<Data<Organization>>(`${this.apiUrl}?queryParams=${JSON.stringify(options)}`);
  }

  queryByName(name: string): Observable<Array<Organization>> {
    return this.http.get<Array<Organization>>(`${this.apiUrl}/query-by-name/${name}`);
  }

  getById(id: number):Observable<Organization> {
    return this.http.get<Organization>(`${this.apiUrl}/${id}`);
  }

  create(organization: Organization):Observable<Object> {
    return this.http.post(`${this.apiUrl}/new`, organization);
  }

  update(organization: Organization):Observable<Object> {
    return this.http.put(`${this.apiUrl}/update`, organization);
  }

  delete(id: number):Observable<Object> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}
