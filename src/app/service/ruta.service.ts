import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RutaService {

  constructor(private http: HttpClient) { }

  getRutaById(ciudadOrigen: number): Observable<any> {
    const URL = 'http://localhost:8080/ruta';
    return this.http.get<any>(URL+"/"+ciudadOrigen);
  }
}
