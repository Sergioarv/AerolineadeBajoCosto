import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { GlobalConstant } from '../utils/constants/global.constants';

@Injectable({
  providedIn: 'root'
})
export class PasajeroService {

  constructor(
    private http: HttpClient
  ) { }

  getById(id: any): Observable<any> {
    const URL = GlobalConstant.URL_ENDPOINT + '/pasajero';
    return this.http.get<any>(URL+'?id='+id );
  }

  getConcurrencia(pasaporte: any, fecha: any): Observable<any> {
    const URL = GlobalConstant.URL_ENDPOINT + '/pasajero/concurrencia'
    let params = ['?pasaporte=','&fecha='];
    return this.http.get<any>(URL+params[0]+pasaporte+params[1]+fecha);
  }

  savePasajero(body: any): Observable<any> {
    const URL = GlobalConstant.URL_ENDPOINT + '/pasajero';
    return this.http.post<any>(URL, body);
  }
}
