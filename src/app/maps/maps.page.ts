import { Component, CUSTOM_ELEMENTS_SCHEMA, ElementRef, ViewChild} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { GoogleMap } from "@capacitor/google-maps";
import { environment } from 'src/environments/environment';


@Component({
  selector: 'app-maps',
  templateUrl: './maps.page.html',
  styleUrls: ['./maps.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]  
})
export class MapsPage{
  @ViewChild('mapRef')
  mapRef!: ElementRef<HTMLElement>;
  newMap!: GoogleMap;


  async createMap() {
    this.newMap = await GoogleMap.create({
      id: 'my-map',
      element: this.mapRef.nativeElement,
      apiKey: environment.mapsKeys,
      config: {
        center: {
          lat: -33.03364357117532,
          lng:  -71.5331795329938,
        },
        zoom: 13,
      },
    });
  }

  async addMarkA(){
    const markerId = await this.newMap.addMarker({
      coordinate: {
        lat: -33.0336435711753,
        lng: -71.5331795329938,
      },
      title: 'DUOC Viña del Mar',
      snippet: 'DUOC'
    })

  }

  async addMarkB(){
    const markerId = await this.newMap.addMarker({
      coordinate: {
        lat: -33.0481265544542,
        lng: -71.4408920089665,
      },
      title: 'Centro de Quilpue'
    })

  }
} 
