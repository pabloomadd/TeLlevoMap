import { Component, OnInit} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { Geolocation } from '@capacitor/geolocation';


declare var google: any;

interface Marker {
  position: {
    lat: number,
    lng: number,
  };
  title: string;
}

@Component({
  selector: 'app-maps',
  templateUrl: './maps.page.html',
  styleUrls: ['./maps.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule],
  
})
export class MapsPage implements OnInit{
  map = null;
  directionsService = new google.maps.DirectionsService();
  directionsDisplay = new google.maps.DirectionsRenderer();
  // DUOC Vina
  origin = { 
    lat: -33.0336435711753,
    lng: -71.5331795329938,
   };
  // Centro de Quilpue
  destination = { 
    lat: -33.0481265544542,
    lng: -71.4408920089665,
   };

  ngOnInit() {
    this.loadMap();
  }

  loadMap() {
    // create a new map by passing HTMLElement
    const mapEle: HTMLElement | null = document.getElementById('map');

    if (mapEle) {
      // create map only if map element is found
      this.map = new google.maps.Map(mapEle, {
        center: this.origin,
        zoom: 12
      });

      this.directionsDisplay.setMap(this.map);

      google.maps.event.addListenerOnce(this.map, 'idle', () => {
        mapEle.classList.add('show-map');
        this.calculateRoute();

      });
    } else {
      console.error('Map element not found');
    }
  }

  addMarker(marker: Marker) {
    return new google.maps.Marker({
      position: marker.position,
      map: this.map,
      title: marker.title
    });
  }

  private calculateRoute() {
  this.directionsService.route({
    origin: this.origin,
    destination: this.destination,
    travelMode: google.maps.TravelMode.DRIVING,
  }, (response: any, status: any)  => {
    if (status === google.maps.DirectionsStatus.OK) {
      this.directionsDisplay.setDirections(response);
    } else {
      alert('Could not display directions due to: ' + status);
    }
  });
  }

  async getCurrentLocation(){
    try {
      const permissionStatus = await Geolocation.checkPermissions();
      console.log('Permission Status: ', permissionStatus.location);
      if (permissionStatus?.location != 'granted') {
        const requestStatus = await Geolocation.requestPermissions();
        if (requestStatus.location != 'granted') {
          //Go to Location Settings
          return;
        }
      }
      let options: PositionOptions = {
        maximumAge: 3000,
        timeout: 10000,
        enableHighAccuracy: false
      };
      const position = await Geolocation.getCurrentPosition(options);
      console.log(position);

    } catch (error) {
      console.log(error);
      throw(error);
      
    }
  }
} 
