import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Data, OrgRepresentative} from "../model";
import {Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class OrgRepresentativeService {
  apiUrl: string = 'http://localhost:8080/organization-representative';

  constructor(private http: HttpClient) {}

  get(options: Data<OrgRepresentative>):Observable<Data<OrgRepresentative>> {
    return this.http.get<Data<OrgRepresentative>>(`${this.apiUrl}?queryParams=${JSON.stringify(options)}`);
  }

  getById(id: number):Observable<OrgRepresentative> {
    return this.http.get<OrgRepresentative>(`${this.apiUrl}/${id}`);
  }

  create(orgRep: OrgRepresentative):Observable<Object> {
    return this.http.post(`${this.apiUrl}/new`, orgRep);
  }

  update(orgRep: OrgRepresentative):Observable<Object> {
    return this.http.put(`${this.apiUrl}/update`, orgRep);
  }

  delete(id: number):Observable<Object> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}
