import { Pasajero } from "./pasajero";
import { Vuelo } from "./vuelo";

export class Tiquete {
    
    idtiquete = '';
    pasajero: Pasajero = new Pasajero;
    vueloida: Vuelo = new Vuelo();
    vueloregreso: Vuelo = new Vuelo();
    valortotal = 0;
}