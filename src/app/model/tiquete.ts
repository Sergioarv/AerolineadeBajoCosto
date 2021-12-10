import { Vuelo } from "./vuelo";

export class Tiquete {
    
    idtiquete = '';
    pasajero = '';
    vueloida: Vuelo = new Vuelo();
    vueloregreso: Vuelo = new Vuelo();
    valortotal = 0;
}