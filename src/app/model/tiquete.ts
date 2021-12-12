import { Pasajero } from "./pasajero";
import { Reserva } from "./reserva";
import { Vuelo } from "./vuelo";

export class Tiquete {
    
    idtiquete = '-1';
    pasajero: Pasajero = new Pasajero;
    vueloida: Vuelo = new Vuelo();
    vueloregreso: Vuelo = new Vuelo();
    valortotal = 0;
    idreserva: Reserva = new Reserva();
}