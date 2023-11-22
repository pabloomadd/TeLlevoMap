import { Component, OnInit} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';


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

  ngOnInit() {
    this.loadMap();
  }

  loadMap() {
    // create LatLng object
    const myLatLng = { lat: 4.658383846282959, lng: -74.09394073486328 };
    
    // create a new map by passing HTMLElement
    const mapEle: HTMLElement | null = document.getElementById('map');

    if (mapEle) {
      // create map only if map element is found
      this.map = new google.maps.Map(mapEle, {
        center: myLatLng,
        zoom: 12
      });

      google.maps.event.addListenerOnce(this.map, 'idle', () => {
        mapEle.classList.add('show-map');
        const marker = {
          position: {
            lat: 4.658383846282959,
            lng: -74.09394073486328 
          },
          title: 'punto uno'
        }
        this.addMarker(marker);
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
} 
