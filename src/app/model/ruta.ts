import { Ciudad } from "./ciudad";

export class Ruta {
    idruta = '-1';
    escala = '';
    duracion = '';
    origen: Ciudad = new Ciudad();
    destino: Ciudad = new Ciudad();
}