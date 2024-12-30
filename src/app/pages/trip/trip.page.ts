import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
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
} from '@ionic/angular/standalone';
import { IViaje } from 'src/app/models/IViaje';
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
    CommonModule,
    FormsModule,
  ],
})
export class TripPage implements OnInit {
  viajeActivo: boolean = false;
  viajes: IViaje[] = [];
  private Subscription!: Subscription;

  isDriver: boolean = true;

  newViaje = {
    nombre: 'ViajePrueba',
    seat1: true,
    seat2: false,
    seat3: false,
    seat4: true,
    start: 'Viña',
    end: 'Quilpue',
    driver: 'Jacinto Paredes',
  };

  constructor(private ViajeService: ViajeService) {}

  ngOnInit() {
    this.loadTrips();
  }

  private loadTrips(): void {
    this.Subscription = this.ViajeService.getTrips().subscribe({
      next: (data) => (this.viajes = data),
      error: (error) => console.error('Error fetching trips:', error),
    });
  }

  createTrip() {
    this.ViajeService.postTrip(this.newViaje).subscribe({
      next: (data) => {
        console.log('Viaje Agregado: ', data);
      },
      error: (error) => {
        console.error('Error al Agregar Viaje: ', error);
      },
      complete: () => console.log('Inserción Completada'),
    });
  }

  resetForm() {
    this.newViaje = {
      nombre: '',
      seat1: true,
      seat2: true,
      seat3: true,
      seat4: true,
      start: '',
      end: '',
      driver: '',
    };
  }
}
