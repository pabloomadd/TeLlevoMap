import { Component, inject, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import {
  IonCol,
  IonContent,
  IonGrid,
  IonHeader,
  IonRow,
  IonTitle,
  IonToolbar,
  IonButton,
  IonModal,
  IonButtons,
  IonItem,
  IonLabel,
  IonInput,
  IonText,
  IonSelect,
  IonSelectOption,
} from '@ionic/angular/standalone';
import { ILocation, IViaje } from 'src/app/models/IViaje';
import { ViajeService } from 'src/app/services/viaje.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-trip',
  templateUrl: './trip.page.html',
  styleUrls: ['./trip.page.css'],
  standalone: true,
  imports: [
    IonInput,
    IonLabel,
    IonButton,
    IonButtons,
    IonContent,
    IonHeader,
    IonTitle,
    IonToolbar,
    IonGrid,
    IonRow,
    IonCol,
    IonModal,
    IonItem,
    IonText,
    IonSelect,
    IonSelectOption,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
  ],
})
export class TripPage implements OnInit {
  private _ViajeService = inject(ViajeService);

  // Arrays Viajes
  viajeActivo: boolean = false;
  viajes: IViaje[] = [];
  ubis: ILocation[] = [];

  // Suscripciones
  private viajeSub!: Subscription;
  private ubiSub!: Subscription;

  // Flags isDriver
  isDriver: boolean = true;
  iDriver: string = 'Sergio Apablaza';

  tripForm!: FormGroup;

  // Viaje de Prueba


  constructor(private formBuilder: FormBuilder) {
    this.tripForm = this.formBuilder.group({
      nombre: ['', [Validators.required, Validators.minLength(6)]],
      seat1: [false, Validators.required],
      seat2: [false, Validators.required],
      seat3: [false, Validators.required],
      seat4: [false, Validators.required],
      start: ['', Validators.required],
      end: ['', Validators.required],
      driver: [this.iDriver, Validators.required],
      state: [true, Validators.required]
    });
  }

  ngOnInit() {
    this.loadTrips();
    this.loadLocations();
  }

  // Suscripcion a GetTrips
  private loadTrips(): void {
    this.viajeSub = this._ViajeService.getTrips().subscribe({
      next: (data) => (this.viajes = data),
      error: (error) => console.error('Error fetching Viajes: ', error),
    });
  }

  createTrip() {
    this._ViajeService.postTrip(this.tripForm.value).subscribe({
      next: (data) => {
        console.log('Viaje Agregado');
      },
      error: (error) => {
        console.error('Error al Agregar Viaje: ', error);
      },
      complete: () => console.log('Inserción Completada'),
    });
  }

  // Suscripcion a GetLocations
  loadLocations() {
    this.ubiSub = this._ViajeService.getLocations().subscribe({
      next: (data) => {
        this.ubis = data;
      },
      error: (error) => console.log('Error fetching Locations: ', error),
    });
  }

  formValidError(controlName: string, errorType: string) {
    return (
      this.tripForm.get(controlName)?.hasError(errorType) &&
      this.tripForm.get(controlName)?.touched
    );
  }
}
