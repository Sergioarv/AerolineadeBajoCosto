import { Ciudad } from "./ciudad";

export class Ruta {
    idruta = '';
    escala = '';
    duracion = '';
    origen: Ciudad = new Ciudad();
    destino: Ciudad = new Ciudad();
}