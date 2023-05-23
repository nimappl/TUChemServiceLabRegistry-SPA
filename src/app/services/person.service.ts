import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { Data, Person } from "../model";

@Injectable({
  providedIn: 'root'
})
export class PersonService {
  apiUrl: string = 'http://localhost:8080/person';

  constructor(private http: HttpClient) {}

  get(options: Data<Person>):Observable<Data<Person>> {
    return this.http.get<Data<Person>>(`${this.apiUrl}?queryParams=${JSON.stringify(options)}`);
  }

  queryByFullName(name: String): Observable<Array<Person>> {
    return this.http.get<Array<Person>>(`${this.apiUrl}/query-by-full-name/${name}`);
  }

  getById(id: number):Observable<Person> {
    return this.http.get<Person>(`${this.apiUrl}/${id}`);
  }

  create(person: Person):Observable<Object> {
    return this.http.post(`${this.apiUrl}/new`, person);
  }

  update(person: Person):Observable<Object> {
    return this.http.put(`${this.apiUrl}/update`, person);
  }

  delete(id: number):Observable<Object> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}
