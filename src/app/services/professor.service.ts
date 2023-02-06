import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Data, TUProfessor} from "../model";
import {Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class ProfessorService {
  apiUrl: string = 'http://localhost:8080/professor';

  constructor(private http: HttpClient) {}

  get(options: Data<TUProfessor>):Observable<Data<TUProfessor>> {
    return this.http.get<Data<TUProfessor>>(`${this.apiUrl}?queryParams=${JSON.stringify(options)}`);
  }

  getGrantList(options: Data<TUProfessor>):Observable<Data<TUProfessor>> {
    return this.http.get<Data<TUProfessor>>(`${this.apiUrl}/grant?queryParams=${JSON.stringify(options)}`);
  }

  getById(id: number):Observable<TUProfessor> {
    return this.http.get<TUProfessor>(`${this.apiUrl}/${id}`);
  }

  create(professor: TUProfessor):Observable<Object> {
    return this.http.post(`${this.apiUrl}/new`, professor);
  }

  update(professor: TUProfessor):Observable<Object> {
    return this.http.put(`${this.apiUrl}/update`, professor);
  }

  delete(id: number):Observable<Object> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}
