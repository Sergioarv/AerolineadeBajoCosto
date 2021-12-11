import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { GlobalConstant } from '../utils/constants/global.constants';

@Injectable({
  providedIn: 'root',
})
export class CiudadService {

  constructor(private http: HttpClient) {
  }

  getAllCiudad(): Observable<any> {
    const URL = GlobalConstant.URL_ENDPOINT + '/ciudad';
    return this.http.get<any>(URL);
  }
}
