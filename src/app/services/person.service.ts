import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { Data, Person, PersonGeneral } from "../model";

@Injectable({
  providedIn: 'root'
})
export class PersonService {
  apiUrl: string = 'http://localhost:8080/person';

  constructor(private http: HttpClient) {}

  get(options: Data<PersonGeneral>):Observable<Data<PersonGeneral>> {
    return this.http.get<Data<PersonGeneral>>(`${this.apiUrl}?queryParams=${JSON.stringify(options)}`);
  }

  queryByFullName(name: String): Observable<Array<Person>> {
    return this.http.get<Array<Person>>(`${this.apiUrl}/query-by-full-name/${name}`);
  }

  getById(id: number):Observable<Person> {
    return this.http.get<Person>(`${this.apiUrl}/${id}`);
  }

  create(person: PersonGeneral):Observable<Object> {
    return this.http.post(`${this.apiUrl}/new`, person);
  }

  update(person: PersonGeneral):Observable<Object> {
    return this.http.put(`${this.apiUrl}/update`, person);
  }

  delete(id: number, all: boolean, typeLab: boolean, typeProf: boolean, typeStdn: boolean, typeOrg: boolean):Observable<Object> {
    return this.http.delete(`${this.apiUrl}/${id}?All=${all}
                                                     &TypeLab=${typeLab}
                                                     &TypeProf=${typeProf}
                                                     &TypeStdn=${typeStdn}
                                                     &TypeOrg=${typeOrg}`);
  }
}
