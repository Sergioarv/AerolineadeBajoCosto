import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { GlobalConstant } from '../utils/constants/global.constants';

@Injectable({
  providedIn: 'root'
})
export class RutaService {

  constructor(private http: HttpClient) { }

  getRutaById(ciudadOrigen: number): Observable<any> {
    const URL = GlobalConstant.URL_ENDPOINT + '/ruta';
    return this.http.get<any>(URL+"/"+ciudadOrigen);
  }
}
