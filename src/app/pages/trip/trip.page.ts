import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonCol, IonContent, IonGrid, IonHeader, IonRow, IonTitle, IonToolbar } from '@ionic/angular/standalone';
import { IViaje } from 'src/app/models/IViaje';
import { ViajeService } from 'src/app/services/viaje.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-trip',
  templateUrl: './trip.page.html',
  styleUrls: ['./trip.page.css'],
  standalone: true,
  imports: [IonContent, IonHeader, IonTitle, IonToolbar, IonGrid, IonRow, IonCol, CommonModule, FormsModule]
})
export class TripPage implements OnInit {

  viajeActivo: boolean = false
  viajes: IViaje[] = [];
  private Subscription!: Subscription;


  constructor(private ViajeService: ViajeService) { }

  ngOnInit() {
    this.loadTrips();
  }

  private loadTrips(): void {
    this.Subscription = this.ViajeService.getTrips().subscribe({
      next: (data) => (this.viajes = data),
      error: (error) => console.error('Error fetching trips:', error),
    });
  }



}
