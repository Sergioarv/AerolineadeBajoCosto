import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Ciudad } from 'src/app/model/ciudad';
import { Ruta } from 'src/app/model/ruta';
import { Tiquete } from 'src/app/model/tiquete';
import { Vuelo } from 'src/app/model/vuelo';
import { CiudadService } from 'src/app/service/ciudad.service';
import { RutaService } from 'src/app/service/ruta.service';
import { VueloService } from 'src/app/service/vuelo.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent implements OnInit {
  ciudadList: Ciudad[];
  rutasList: Ruta[];
  vueloIdaList: Vuelo[];
  vueloRegresoList: Vuelo[];
  dateNow: Date;
  minDate: any;
  maXDate: any;

  descuIda: number = 0;
  descuRegreso: number = 0;
  cantDePasajeros;

  vueloDeIda: Vuelo;
  vueloDeRegreso: Vuelo;

  tiqueteList!: Tiquete[];

  reg: RegExp = /[0-9]/;

  activeStep: boolean[] = [true, false, false, false, false, false, false, false, false, false, false];

  formBusqueda = new FormGroup({
    ciudadOrigen: new FormControl(),
    ciudadDestino: new FormControl(),
    fechaVueloIda: new FormControl(),
    cantPasajeros: new FormControl(1, [Validators.pattern('^[0-9]+')])
  });

  formBusquedaRegreso = new FormGroup({
    ciudadOrigenRegreso: new FormControl(),
    ciudadDestinoRegreso: new FormControl(),
    fechaVueloRegreso: new FormControl()
  });

  constructor(
    private ciudadService: CiudadService,
    private rutaService: RutaService,
    private vueloService: VueloService,
    private datePipe: DatePipe,
  ) {
    this.ciudadList = [];
    this.rutasList = [];
    this.vueloIdaList = [];
    this.vueloRegresoList = [];
    this.tiqueteList = [];
    this.dateNow = new Date();
    this.vueloDeIda = new Vuelo();
    this.vueloDeRegreso = new Vuelo;
    this.cantDePasajeros = 1;
    this.minDate = this.datePipe.transform(this.dateNow, 'yyyy-MM-dd');
  }

  ngOnInit(): void {
    this.getAllCiudad();
    this.toggle(0);
    this.formBusqueda.get('ciudadOrigen')?.setValue('');
    this.formBusqueda.get('ciudadDestino')?.setValue('');
    this.formBusqueda.get('fechaVueloIda')?.setValue(this.datePipe.transform(this.dateNow, 'yyyy-MM-dd'));
    this.formBusquedaRegreso.get('ciudadOrigenRegreso')?.setValue('');
    this.formBusquedaRegreso.get('ciudadDestinoRegreso')?.setValue('');
    this.formBusquedaRegreso.get('fechaVueloRegreso')?.setValue(this.datePipe.transform(this.dateNow, 'yyyy-MM-dd'));
  }

  getAllCiudad(): void {
    this.ciudadService.getAllCiudad().subscribe((resp) => {
      this.ciudadList = resp;
    });
  }

  selectDestino(tipo: any): void {
    if (tipo == 1) {
      this.formBusqueda.get('ciudadDestino')?.setValue('');
      const ciudadO = this.formBusqueda.controls['ciudadOrigen'].value;
      if (ciudadO != '') {
        this.rutaService.getRutaById(ciudadO).subscribe((resp) => {
          this.rutasList = resp;
        });
      }
    }

    if (tipo == 2) {
      this.formBusqueda.get('ciudadDestinoRegreso')?.setValue('');
      const ciudadO = this.formBusquedaRegreso.controls['ciudadOrigenRegreso'].value;
      if (ciudadO != '') {
        this.rutaService.getRutaById(ciudadO).subscribe((resp) => {
          this.rutasList = resp;
        });
      }
    }
  }

  buscarVueloIda(): void {
    const ruta = this.formBusqueda.controls['ciudadDestino'].value;
    const fechaIda = this.formBusqueda.controls['fechaVueloIda'].value;
    const cantPasajeros = this.formBusqueda.controls['cantPasajeros'].value;
    
    this.vueloService.buscarVuelos(fechaIda, ruta).subscribe((resp) => {
      this.vueloIdaList = resp;
      this.descuIda = this.calcDesc(fechaIda);
    });
  }

  calcDesc(fechaFinal: Date): any {

    let days = Math.floor((Date.UTC(new Date(fechaFinal).getFullYear(), new Date(fechaFinal).getMonth(), new Date(fechaFinal).getDate())-Date.UTC(new Date(this.dateNow).getFullYear(), new Date(this.dateNow).getMonth(), new Date(this.dateNow).getDate()) )/(1000 * 60 * 60 * 24));
    let descuPorFecha;

    if(days >= 0 && days < 15){
      descuPorFecha = 1;
    } else if(days >= 15 && days < 50){
      descuPorFecha = (100-days)/100;
    } else {
      descuPorFecha = 50/100;
    }

    return descuPorFecha;
  }

  buscarVueloRegreso(): void {
    const ruta = this.formBusquedaRegreso.controls['ciudadDestinoRegreso'].value;
    const fechaRegreso = this.formBusquedaRegreso.controls['fechaVueloRegreso'].value;

    this.vueloService.buscarVuelos(fechaRegreso, ruta).subscribe((resp) => {
      this.vueloRegresoList = resp;
      this.descuRegreso = this.calcDesc(fechaRegreso);
    });
  }


  selectVuelo(vuelo: Vuelo, tipo: number): void {
    if (tipo == 1) {
      this.vueloDeIda = vuelo != undefined ? vuelo : new Vuelo();
    }else if(tipo == 2){
      this.vueloDeRegreso = vuelo != undefined ? vuelo : new Vuelo();
    }
  }

  vueloIda(): void {
    if (this.vueloDeIda.idvuelo != '') {
      this.formBusquedaRegreso.get('ciudadOrigenRegreso')?.setValue(this.vueloDeIda.idruta.destino.idciudad);
      this.cantDePasajeros = this.formBusqueda.controls['cantPasajeros'].value;
      this.selectDestino(2);
      this.toggle(1);
    }
  }

  vueloRegreso(): void {
    if (this.vueloDeRegreso.idvuelo != '') {
      this.toggle(2);
    }
  }

  // Funcion para habilitar y deshabilitar acordiones
  toggle(desbloquearCuadro: number) {

    for (let i = 0; i < 11; i++) {
      this.activeStep[i] = false;
    }

    this.activeStep[desbloquearCuadro] = true;
  }
}
