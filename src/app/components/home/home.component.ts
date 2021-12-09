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
  dateNow: Date;
  minDate: any;
  maXDate: any;

  formBusqueda = new FormGroup({
    ciudadOrigen: new FormControl(),
    ciudadDestino: new FormControl(),
    fechaVueloIda: new FormControl()
  });

  constructor(
    private ciudadService: CiudadService,
    private rutaService: RutaService,
    private vueloService: VueloService,
    private datePipe: DatePipe
  ) {
    this.ciudadList = [];
    this.rutasList = [];
    this.vueloIdaList = []
    this.dateNow = new Date();
    this.minDate = this.datePipe.transform(this.dateNow, 'yyyy-MM-dd');
  }

  ngOnInit(): void {
    this.getAllCiudad();
    this.formBusqueda.get('ciudadOrigen')?.setValue('');
    this.formBusqueda.get('ciudadDestino')?.setValue('');
    this.formBusqueda.get('fechaVueloIda')?.setValue(this.datePipe.transform(this.dateNow, 'yyyy-MM-dd'));
  }

  getAllCiudad(): void {
    this.ciudadService.getAllCiudad().subscribe((resp) => {
      this.ciudadList = resp;
      console.log('Ciudades', this.ciudadList);
    });
  }

  selectDestino(): void {
    this.formBusqueda.get('ciudadDestino')?.setValue('');
    const ciudadO = this.formBusqueda.controls['ciudadOrigen'].value;
    console.log("Ciudad", ciudadO);
    if (ciudadO != '') {
      this.rutaService.getRutaById(ciudadO).subscribe((resp) => {
        this.rutasList = resp;
      });
    }
  }

  buscarVueloIda(): void {
    const ruta = this.formBusqueda.controls['ciudadDestino'].value;
    const fechaIda = this.formBusqueda.controls['fechaVueloIda'].value;

    this.vueloService.buscarVuelos(fechaIda, ruta).subscribe( (resp) => {
      this.vueloIdaList = resp;
    });
  }

  prueba(vuelo: any): any {
    console.log("Vuelo Seleccionado", vuelo);
  }
}
