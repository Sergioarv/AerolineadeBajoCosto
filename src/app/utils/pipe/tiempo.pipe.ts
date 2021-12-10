import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'tiempo'
})
export class TiempoPipe implements PipeTransform {

  transform(value: any): any {
    let horas: any = Math.floor((value / 60) % 60);
    horas = (horas < 10)? '0' + horas : horas;
    let minutos: any = value % 60;
    minutos = (minutos < 10)? '0' + minutos : minutos;
    return horas != '00'? horas +'h ' + minutos + 'm' : minutos + 'm';
  }

}
