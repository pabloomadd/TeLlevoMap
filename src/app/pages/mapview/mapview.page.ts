import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonButton } from '@ionic/angular/standalone';

@Component({
  selector: 'app-mapview',
  templateUrl: './mapview.page.html',
  styleUrls: ['./mapview.page.css'],
  standalone: true,
  imports: [IonContent, IonHeader, IonTitle, IonToolbar, IonButton, CommonModule, FormsModule]
})
export class MapviewPage {

  private map: any;

  constructor() { }

  ionViewDidEnter() {
    this.initializeMap(); // Llamamos a la función para inicializar el mapa
  }

  private initializeMap(): void {
    const mapContainer = document.querySelector('#map');
    if (!mapContainer) {
      console.error('El contenedor del mapa no existe en el DOM.');
      return;
    }

    // Configurar la clave de MapQuest
    (window as any).L.mapquest.key = 'ryfb8F8VeELbjrG7qz7lBXKPPZukggcs';

    // Crear el mapa utilizando la API de MapQuest
    this.map = (window as any).L.mapquest.map('map', {
      center: [-33.023972, -71.566528], // Coordenadas iniciales
      layers: (window as any).L.mapquest.tileLayer('map'), // Capa base del mapa
      zoom: 12, // Nivel de zoom inicial
    });

  }

  addRoute() {
    const directions = (window as any).L.mapquest.directions();
    
    
    directions.route({

      locations: [

        {
          latLng: { lat: -33.033491293857395, lng: -71.53321628951454 }, 
          title: 'Duoc Viña', 
        }, {
          latLng: { lat: -33.04818348312141, lng: -71.44138152489775 }, 
          title: 'Cnetro de Quilpué', 
        }
      ],
      options: {
        routeType: 'fastest',
        locale: 'es_ES'
      }

    })
  }

  addCustomMarkers() {
    const customWaypoints = [
      {
        latLng: { lat: 40.748817, lng: -73.985428 },
        title: 'Empire State Building',
      },
      {
        latLng: { lat: 40.752726, lng: -73.977229 },
        title: 'Chrysler Building',
      },
      {
        latLng: { lat: 40.711512, lng: -74.013213 },
        title: 'One Liberty Plaza',
      },
    ];

    // Agregar marcadores personalizados
    customWaypoints.forEach((waypoint) => {
      (window as any).L.marker([waypoint.latLng.lat, waypoint.latLng.lng], {
        icon: (window as any).L.mapquest.icons.marker({
          primaryColor: '#22407F',
          secondaryColor: '#3B5998',
          size: 'md',
        }),
      })
        .bindPopup(waypoint.title) // Asignar el título personalizado
        .addTo(this.map);
    });
  }


}