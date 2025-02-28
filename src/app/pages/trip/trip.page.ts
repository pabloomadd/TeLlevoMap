import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import {
  IonContent,
  IonHeader,
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
import { UserService } from 'src/app/services/user.service';
import { IUser } from 'src/app/models/IUser';

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
  // Services
  private _viajeService = inject(ViajeService);
  private _userService = inject(UserService);

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

  // Forms
  tripForm!: FormGroup;

  // User Vars
  user?: IUser;
  userMail?: string;
  userName!: string;

  // Subscriptions
  private userSub!: Subscription;

  constructor(private formBuilder: FormBuilder) {
    this.tripForm = this.formBuilder.group({
      nombre: ['', [Validators.required, Validators.minLength(6)]],
      seat1: [null],
      seat2: [null],
      seat3: [null],
      seat4: [null],
      start: ['', Validators.required],
      end: ['', Validators.required],
      driver: ['', Validators.required],
      state: [true, Validators.required],
    });
  }

  ngOnInit() {
    // this.loadTrips();
    this.getUser();
    this.loadLocations();
  }

  // Suscripcion a GetTrips
  // Correccion: Obtener historial de Trips
  private loadTrips(): void {
    this.viajeSub = this._viajeService.getTrips().subscribe({
      next: (data) => (this.viajes = data),
      error: (error) => console.error('Error fetching Viajes: ', error),
    });
  }

  createTrip() {
    this._viajeService.postTrip(this.tripForm.value).subscribe({
      next: (data) => {
        console.log('Viaje Agregado');

        // Obtener Viaje para Driver
        this._viajeService.getDriverIdTrip(this.user!.id).subscribe({
          next: (tripIdObt) => {
            const idObt = tripIdObt.id;

            // Agregar Trip al Driver
            this._userService.addTripToUser(this.user!.id, idObt);
          },
        });
      },
      error: (error) => {
        console.error('Error al Agregar Viaje: ', error);
      },
      complete: () => console.log('Inserción Completada'),
    });
  }

  // Suscripcion a GetLocations
  loadLocations() {
    this.ubiSub = this._viajeService.getLocations().subscribe({
      next: (data) => {
        this.ubis = data;
      },
      error: (error) => console.log('Error fetching Locations: ', error),
    });
  }

  async getUser() {
    // Obtener Sesión
    try {
      const { data, error } = await this._userService.getUsrSession();

      if (error) {
        console.log('Error al Obtener Sesión: ', error);
        return;
      }

      if (data?.user) {
        this.userMail = data.user.email;

        if (this.userMail) {
          this.userSub = this._userService
            .getUserData(this.userMail)
            .subscribe({
              next: (data) => {
                this.user = data;

                // Asignacion de userName
                this.userName = `${this.user.name} ${this.user.lastname}`;

                // Asignacion de Driver para Trip
                this.tripForm.controls['driver'].setValue(this.user.id);
              },

              error: (error) =>
                console.log('Error Obteniendo UserData: ', error),
            });
        }
      } else {
        console.log('No hay Usuario Autenticado');
      }
    } catch (error) {
      console.log('Algo salio mal: ', error);
    }
  }

  // OTHER FUNCTIONS
  formValidError(controlName: string, errorType: string) {
    return (
      this.tripForm.get(controlName)?.hasError(errorType) &&
      this.tripForm.get(controlName)?.touched
    );
  }
}
