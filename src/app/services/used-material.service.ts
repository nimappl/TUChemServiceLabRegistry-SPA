import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Data, IMUsedMaterial} from "../model";
import {Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class UsedMaterialService {
  apiUrl: string = 'http://localhost:8080/used-material';

  constructor(private http: HttpClient) {}

  get(options: Data<IMUsedMaterial>):Observable<Data<IMUsedMaterial>> {
    return this.http.get<Data<IMUsedMaterial>>(`${this.apiUrl}?queryParams=${JSON.stringify(options)}`);
  }

  getById(id: number):Observable<IMUsedMaterial> {
    return this.http.get<IMUsedMaterial>(`${this.apiUrl}/${id}`);
  }

  queryByName(name: string): Observable<Array<IMUsedMaterial>> {
    return this.http.get<Array<IMUsedMaterial>>(`${this.apiUrl}/query-by-name/${name}`);
  }

  getForMaintenance(maintenanceId):Observable<Array<IMUsedMaterial>> {
    return this.http.get<Array<IMUsedMaterial>>(`${this.apiUrl}/for-maintenance/${maintenanceId}`);
  }

  create(usedMaterial: IMUsedMaterial):Observable<Object> {
    return this.http.post(`${this.apiUrl}/new`, usedMaterial);
  }

  update(usedMaterial: IMUsedMaterial):Observable<Object> {
    return this.http.put(`${this.apiUrl}/update`, usedMaterial);
  }

  delete(id: number):Observable<Object> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}
