import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { Ciudad } from 'src/app/model/ciudad';
import { Pasajero } from 'src/app/model/pasajero';
import { Reserva } from 'src/app/model/reserva';
import { Ruta } from 'src/app/model/ruta';
import { Tiquete } from 'src/app/model/tiquete';
import { Vuelo } from 'src/app/model/vuelo';
import { CiudadService } from 'src/app/service/ciudad.service';
import { PasajeroService } from 'src/app/service/pasajero.service';
import { ReservaService } from 'src/app/service/reserva.service';
import { RutaService } from 'src/app/service/ruta.service';
import { TiqueteService } from 'src/app/service/tiquete.service';
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
  tiqueteList: Tiquete[];
  dateNow: Date;
  minDate: any;
  maXDate: any;

  descuIda: number = 0;
  descuRegreso: number = 0;
  cantDePasajeros;
  cantRestantePasajeros = 0;

  viajeroFrecuente = 0;

  vueloDeIda: Vuelo;
  vueloDeRegreso: Vuelo;

  pasajero: Pasajero;
  tiquete: Tiquete;
  reserva: Reserva;

  reg: RegExp = /[0-9]/;

  activeStep: boolean[] = [true, false, false, false, false, false, false, false, false, false, false];

  formBusqueda = new FormGroup({
    ciudadOrigen: new FormControl(),
    ciudadDestino: new FormControl(),
    fechaVueloIda: new FormControl(),
    cantPasajeros: new FormControl(1, [Validators.pattern('^[0-9]+')]),
  });

  formBusquedaRegreso = new FormGroup({
    ciudadOrigenRegreso: new FormControl(),
    ciudadDestinoRegreso: new FormControl(),
    fechaVueloRegreso: new FormControl(),
  });

  formPasajeros = new FormGroup({
    pasaporte: new FormControl(),
    nombrePasajero: new FormControl('', [Validators.required,
    Validators.pattern('^[A-Za-zñÑáéíóúÁÉÍÓÚ]+[A-Za-zñÑáéíóúÁÉÍÓÚ\\s]+[A-Za-zñÑáéíóúÁÉÍÓÚ]$'),
    ]),
    apellidoPasajero: new FormControl('', [Validators.required,
    Validators.pattern('^[A-Za-zñÑáéíóúÁÉÍÓÚ]+[A-Za-zñÑáéíóúÁÉÍÓÚ\\s]+[A-Za-zñÑáéíóúÁÉÍÓÚ]$'),
    ]),
    telefono: new FormControl([Validators.required,
    Validators.minLength(10),
    Validators.maxLength(10),
    ]),
    email: new FormControl('', [Validators.required,
    Validators.pattern('^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,4}$'),
    ]),
    edad: new FormControl(1, [Validators.required,]),
    fechaExpedicion: new FormControl(),
  });

  constructor(
    private ciudadService: CiudadService,
    private rutaService: RutaService,
    private vueloService: VueloService,
    private pasajeroService: PasajeroService,
    private tiqueteService: TiqueteService,
    private reservaService: ReservaService,
    private datePipe: DatePipe
  ) {
    this.ciudadList = [];
    this.rutasList = [];
    this.vueloIdaList = [];
    this.vueloRegresoList = [];
    this.tiqueteList = [];
    this.pasajero = new Pasajero();
    this.tiquete = new Tiquete();
    this.reserva = new Reserva();
    this.dateNow = new Date();
    this.vueloDeIda = new Vuelo();
    this.vueloDeRegreso = new Vuelo();
    this.cantDePasajeros = 1;
    this.minDate = this.datePipe.transform(this.dateNow, 'yyyy-MM-dd');
  }

  ngOnInit(): void {
    this.getAllCiudad();
    this.toggle(0);
    this.formBusqueda.get('ciudadOrigen')?.setValue('');
    this.formBusqueda.get('ciudadDestino')?.setValue('');
    this.formBusqueda
      .get('fechaVueloIda')
      ?.setValue(this.datePipe.transform(this.dateNow, 'yyyy-MM-dd'));
    this.formBusquedaRegreso.get('ciudadOrigenRegreso')?.setValue('');
    this.formBusquedaRegreso.get('ciudadDestinoRegreso')?.setValue('');
    this.formBusquedaRegreso
      .get('fechaVueloRegreso')
      ?.setValue(this.datePipe.transform(this.dateNow, 'yyyy-MM-dd'));
    this.formPasajeros
      .get('fechaExpedicion')
      ?.setValue(this.datePipe.transform(this.dateNow, 'yyyy-MM-dd'));
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
      const ciudadO =
        this.formBusquedaRegreso.controls['ciudadOrigenRegreso'].value;
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
    }, error => {
    });
  }

  calcDesc(fechaFinal: Date): any {
    let days = Math.floor(
      (Date.UTC(
        new Date(fechaFinal).getFullYear(),
        new Date(fechaFinal).getMonth(),
        new Date(fechaFinal).getDate()
      ) -
        Date.UTC(
          new Date(this.dateNow).getFullYear(),
          new Date(this.dateNow).getMonth(),
          new Date(this.dateNow).getDate()
        )) /
      (1000 * 60 * 60 * 24)
    );
    let descuPorFecha;

    if (days >= 0 && days < 15) {
      descuPorFecha = 1;
    } else if (days >= 15 && days < 50) {
      descuPorFecha = (100 - days) / 100;
    } else {
      descuPorFecha = 50 / 100;
    }

    return descuPorFecha;
  }

  buscarVueloRegreso(): void {
    const ruta =
      this.formBusquedaRegreso.controls['ciudadDestinoRegreso'].value;
    const fechaRegreso =
      this.formBusquedaRegreso.controls['fechaVueloRegreso'].value;

    this.vueloService.buscarVuelos(fechaRegreso, ruta).subscribe((resp) => {
      this.vueloRegresoList = resp;
      this.descuRegreso = this.calcDesc(fechaRegreso);
    });
  }

  selectVuelo(vuelo: Vuelo, tipo: number): void {
    if (tipo == 1) {
      this.vueloDeIda = vuelo != undefined ? vuelo : new Vuelo();
    } else if (tipo == 2) {
      this.vueloDeRegreso = vuelo != undefined ? vuelo : new Vuelo();
    }
  }

  vueloIda(): void {
    if (this.vueloDeIda.idvuelo != '') {
      this.formBusquedaRegreso
        .get('ciudadOrigenRegreso')
        ?.setValue(this.vueloDeIda.idruta.destino.idciudad);
      this.cantDePasajeros = this.formBusqueda.controls['cantPasajeros'].value;
      this.selectDestino(2);
      this.toggle(1);
    }
  }

  vueloRegreso(): void {
    if (this.vueloDeRegreso.idvuelo != '') {
      console.log('Vuelo de Ida', this.vueloDeIda);
      this.toggle(2);
    }
  }
  //Terminar la carga de pasajeros
  validarPasajeros(): void {
    if (this.formPasajeros.valid) {
      if (this.cantRestantePasajeros < this.cantDePasajeros) {

        let id = this.formPasajeros.controls['pasaporte'].value;
        this.pasajeroService.getById(id).subscribe(resp => {
          if (resp != null) {
            this.pasajero = resp;
            this.pasajero.telefono = this.formPasajeros.controls['telefono'].value;
            this.pasajero.email = this.formPasajeros.controls['email'].value;
            this.pasajero.edad = this.formPasajeros.controls['edad'].value;
            this.pasajero.millasacumuladas += this.vueloDeIda.millas + this.vueloDeRegreso.millas;
            const fechaExp = this.formPasajeros.controls['fechaExpedicion'].value;
            this.pasajero.fechaExpedicion = this.vueloDeIda.idruta.destino.visado ? fechaExp : '';
          } else {
            this.pasajero.pasaporte = this.formPasajeros.controls['pasaporte'].value;
            this.pasajero.nombre = this.formPasajeros.controls['nombrePasajero'].value;
            this.pasajero.apellido = this.formPasajeros.controls['apellidoPasajero'].value;
            this.pasajero.telefono = this.formPasajeros.controls['telefono'].value;
            this.pasajero.email = this.formPasajeros.controls['email'].value;
            this.pasajero.edad = this.formPasajeros.controls['edad'].value;
            const fechaExp = this.formPasajeros.controls['fechaExpedicion'].value;
            this.pasajero.fechaExpedicion = this.vueloDeIda.idruta.destino.visado ? fechaExp : '';
            this.pasajero.millasacumuladas += this.vueloDeIda.millas + this.vueloDeRegreso.millas;
          }
          this.pasajeroService.savePasajero(this.pasajero).subscribe((resp) => {
            this.pasajero = resp;
            
            this.reservaService.saveReserva(this.reserva).subscribe(data => {

              this.verificarFecuencia(this.pasajero.pasaporte);

              let valorTotal = (this.vueloDeIda.precio * this.descuIda) + (this.vueloDeRegreso.precio * this.descuRegreso);
              this.tiquete.pasajero = this.pasajero;
              this.tiquete.vueloida = this.vueloDeIda;
              this.tiquete.vueloregreso = this.vueloDeRegreso;
              this.tiquete.idreserva = data;
              
              valorTotal = this.viajeroFrecuente >= 10 ? (this.viajeroFrecuente >= 15 ? valorTotal * 0.90 : valorTotal * 0.95) : valorTotal;
              valorTotal = this.pasajero.edad > 65 ? valorTotal * 0.97 : (this.pasajero.edad < 2 ? valorTotal * 0.10 : valorTotal);
              
              this.tiquete.valortotal = valorTotal;

              this.tiqueteService.saveTiquete(this.tiquete).subscribe(resp => {

                this.tiqueteList.push(resp);
                this.cantRestantePasajeros += 1;

                this.resetFormPasajeros();

                if (this.cantRestantePasajeros == this.cantDePasajeros) {
                  this.enviarPDFS();
                }
              })
            })
          });
        },
          error => {
            console.error("Errro con pasajeros", error);
          });
      } else {
        this.toggle(5);
      }
    }
  }

  verificarFecuencia(pasaporte: any){

    const dateStart: Date = new Date();
    dateStart.setDate(new Date().getDate() - 365);

    this.pasajeroService.getConcurrencia(pasaporte, this.datePipe.transform(dateStart, 'yyyy-MM-dd')).subscribe( resp => {
      this.viajeroFrecuente = resp;
    })
  }

  enviarPDFS(){
    console.log("Enviando PDFs", this.tiqueteList);
  }

  resetFormPasajeros() {
    this.formPasajeros.get('pasaporte')?.setValue('');
    this.formPasajeros.get('nombrePasajero')?.setValue('');
    this.formPasajeros.get('apellidoPasajero')?.setValue('');
    this.formPasajeros.get('telefono')?.setValue(1);
    this.formPasajeros.get('email')?.setValue('');
    this.formPasajeros.get('edad')?.setValue(1);
    this.formPasajeros.get('fechaExpedicion')?.setValue(this.datePipe.transform(this.dateNow, 'yyyy-MM-dd'));
  }

  // Funcion para habilitar y deshabilitar acordiones
  toggle(desbloquearCuadro: number) {
    for (let i = 0; i < 11; i++) {
      this.activeStep[i] = false;
    }

    this.activeStep[desbloquearCuadro] = true;
  }
}
