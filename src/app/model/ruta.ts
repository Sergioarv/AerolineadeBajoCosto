import { Ciudad } from "./ciudad";

export class Ruta {
    idruta = '';
    escala = '';
    duracion = '';
    origen!: Ciudad;
    destino!: Ciudad;
}