import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { GlobalConstant } from '../utils/constants/global.constants';

@Injectable({
  providedIn: 'root'
})
export class ReservaService {

  constructor(
    private http: HttpClient
  ) { }

  saveReserva(body: any): Observable<any> {
    const URL = GlobalConstant.URL_ENDPOINT + '/reserva';
    return this.http.post<any>(URL, body);
  }
}
