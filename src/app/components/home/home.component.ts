import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Ciudad } from 'src/app/model/ciudad';
import { Ruta } from 'src/app/model/ruta';
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

  vueloDeIda: Vuelo;

  activeStep: boolean[] = [true, false, false, false, false, false, false, false, false, false, false];

  formBusqueda = new FormGroup({
    ciudadOrigen: new FormControl(),
    ciudadDestino: new FormControl(),
    fechaVueloIda: new FormControl()
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
    private datePipe: DatePipe
  ) {
    this.ciudadList = [];
    this.rutasList = [];
    this.vueloIdaList = [];
    this.vueloRegresoList = [];
    this.dateNow = new Date();
    this.vueloDeIda = new Vuelo();
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

    this.vueloService.buscarVuelos(fechaIda, ruta).subscribe((resp) => {
      this.vueloIdaList = resp;
    });
  }

  buscarVueloRegreso(): void {
    const ruta = this.formBusquedaRegreso.controls['ciudadDestinoRegreso'].value;
    const fechaRegreso = this.formBusquedaRegreso.controls['fechaVueloRegreso'].value;

    this.vueloService.buscarVuelos(fechaRegreso, ruta).subscribe((resp) => {
      this.vueloRegresoList = resp;
    });
  }

  selectVuelo(vuelo: Vuelo): void {
    this.vueloDeIda = vuelo != undefined ? vuelo : new Vuelo();
  }

  vueloIda(): void {
    if (this.vueloDeIda.idvuelo != '') {
      this.formBusquedaRegreso.get('ciudadOrigenRegreso')?.setValue(this.vueloDeIda.idruta.destino.idciudad);
      console.log('Antes de continuar', this.formBusquedaRegreso.controls['ciudadOrigenRegreso'].value);
      this.selectDestino(2);
      this.toggle(1);
    }
  }

  vueloRegreso(): void {
    if (this.vueloDeIda.idvuelo != '') {
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
