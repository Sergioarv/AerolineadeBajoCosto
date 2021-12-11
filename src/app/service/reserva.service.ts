import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ReservaService {

  constructor(
    private http: HttpClient
  ) { }

  saveReserva(body: any): Observable<any> {
    const URL = 'http://localhost:8080/reserva';
    return this.http.post<any>(URL, body);
  }
}
