import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { Data, EduGroup } from "../model";
import { Observable } from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class EduGroupService {
  apiUrl: string = 'http://localhost:8080/edu-group';

  constructor(private http: HttpClient) {}

  get(options: Data<EduGroup>):Observable<Data<EduGroup>> {
    return this.http.get<Data<EduGroup>>(`${this.apiUrl}?queryParams=${JSON.stringify(options)}`);
  }

  getById(id: number):Observable<EduGroup> {
    return this.http.get<EduGroup>(`${this.apiUrl}/${id}`);
  }

  create(eduGroup: EduGroup):Observable<number> {
    return this.http.post<number>(`${this.apiUrl}/new`, eduGroup);
  }

  update(eduGroup: EduGroup):Observable<Object> {
    return this.http.put(`${this.apiUrl}/update`, eduGroup);
  }

  delete(id: number):Observable<Object> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}
