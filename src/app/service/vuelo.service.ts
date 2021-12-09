import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class VueloService {

  constructor(
    private http: HttpClient
  ) { }

  buscarVuelos(fechaVuelo: any, idRuta: any): Observable<any> {
    const URL = 'http://localhost:8080/vuelo/buscarvuelos';
    let params = '';
    // tslint:disable-next-line: max-line-length
    params = fechaVuelo ? (params.length > 0 ? params.concat('&fechaVuelo=').concat(fechaVuelo) : params.concat('?fechaVuelo=').concat(fechaVuelo)) :  params;
    params = idRuta ? (params.length > 0 ? params.concat('&idRuta=').concat(idRuta) : params.concat('?idRuta=').concat(idRuta)) : params;
    return this.http.get<any>(URL + params);
  }

}
