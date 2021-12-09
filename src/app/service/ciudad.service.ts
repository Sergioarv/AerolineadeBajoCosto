import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CiudadService {
  constructor(private http: HttpClient) {}

  getAllCiudad(): Observable<any> {
    const URL = 'http://localhost:8080/ciudad';
    return this.http.get<any>(URL);
  }
}
