import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TiqueteService {

  constructor(
    private http: HttpClient
  ) { }

  saveTiquete(body: any): Observable<any> {
    const URL = 'http://localhost:8080/tiquete';
    return this.http.post<any>(URL, body);
  }
}
