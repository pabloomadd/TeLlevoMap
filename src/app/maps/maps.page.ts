import { Component, OnInit} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AlertController, IonicModule } from '@ionic/angular';
import { Geolocation } from '@capacitor/geolocation';
import { ViajeModel } from '../models/ViajeModel';
import { ViajeService } from '../services/viajeService/viaje.service';
import { lastValueFrom } from 'rxjs';
import { HttpClientModule } from '@angular/common/http';

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
  imports: [IonicModule, CommonModule, FormsModule, HttpClientModule],
  providers: [ViajeService],
  
})
export class MapsPage implements OnInit{
  alertButtons = ['Action'];
  
  map = null;
  directionsService = new google.maps.DirectionsService();
  directionsDisplay = new google.maps.DirectionsRenderer();
  
  origin = { 
    lat: 0,
    lng: 0,
   };
  
  destination = { 
    lat: 0,
    lng: 0,
   };

  lugarInicio: string = '';
  lugarDestino: string = '';


  constructor(private _viajeService: ViajeService, public alertCtrl: AlertController){} 

  ngOnInit() {
    this.getViaje();
    this.loadMap();
  }


  message = 'This modal example uses triggers to automatically open a modal';
  user!: number;
  name!: string;
  id_viaje!: number;
  conductor!: any;
  viajes: any;
  viajeSeleccionado: ViajeModel = {
    id: this.id_viaje,
    nombre: '',
    conductor: this.user,
    cantAsientosDisp: 0,
    lugarInicio: '',
    lugarDestino: '',
    estado: 1
  };
  

  async getViaje(){
    this.viajes = await lastValueFrom(this._viajeService.getAllViajes());
    console.log("listaViajes:", this.viajes)
  }
  

  loadMap() {
    // create a new map by passing HTMLElement
    const mapEle: HTMLElement | null = document.getElementById('map');

    if (mapEle) {
      // create map only if map element is found
      this.map = new google.maps.Map(mapEle, {
        center: {
          //Viña
          lat: -33.02254395854375, 
          lng: -71.55173445693278
        },
        zoom: 12
      });

      this.directionsDisplay.setMap(this.map);
      google.maps.event.addListenerOnce(this.map, 'idle', () => {
        mapEle.classList.add('show-map'); 
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


  async verRuta() {
    if (this.viajeSeleccionado && this.viajeSeleccionado.lugarDestino && this.viajeSeleccionado.lugarInicio) {
      try {
        // Llamar a la función getCoordsUbicacion del servicio ViajeService para el lugar de destino
        const ubicacionDestino = await lastValueFrom(this._viajeService.getCoordsUbicacion(this.viajeSeleccionado.lugarDestino));
  
        // Llamar a la función getCoordsUbicacion del servicio ViajeService para el lugar de inicio
        const ubicacionInicio = await lastValueFrom(this._viajeService.getCoordsUbicacion(this.viajeSeleccionado.lugarInicio));
        
        // Imprimir el resultado obtenido por consola
        console.log('Resultado de la ubicación del lugar de destino:', ubicacionDestino);
        console.log('Resultado de la ubicación del lugar de inicio:', ubicacionInicio);

        if (ubicacionDestino && ubicacionDestino.length > 0 && ubicacionInicio && ubicacionInicio.length > 0) {
          // Asignar los valores de ubicación a las variables de lugarInicio y lugarDestino
          this.lugarInicio = this.viajeSeleccionado.lugarInicio;
          this.lugarDestino = this.viajeSeleccionado.lugarDestino;

          // Asignar los valores de latitud y longitud a las variables origin y destination
          this.origin.lat = ubicacionInicio[0].latitud;
          this.origin.lng = ubicacionInicio[0].longitud;
          this.destination.lat = ubicacionDestino[0].latitud;
          this.destination.lng = ubicacionDestino[0].longitud;
          
          //Calcular Ruta
          this.calculateRoute();
        }else{
          console.error('No se encontraron datos de ubicación para el inicio o el destino');
        }

      } catch (error) {
        console.error('Error al obtener la ubicación:', error);
      }
    } else {
      const alert = await this.alertCtrl.create({
        header: 'Mapa',
        message: 'Debe seleccionar un Viaje.',
        buttons: ['OK']
      });
  
      await alert.present();
    }
  }

  private calculateRoute() {
    this.directionsService.route({
      origin: this.origin,
      destination: this.destination,
      travelMode: google.maps.TravelMode.DRIVING,
    }, (response: any, status: any) => {
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
