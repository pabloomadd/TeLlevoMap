import { Component, inject, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AnyLayer, LngLatLike, Map } from 'mapbox-gl';
import { MAPBOX_API_KEY, NgxMapboxGLModule } from 'ngx-mapbox-gl';
import { environment } from 'src/environments/environment.development';
import { Geolocation } from '@capacitor/geolocation';
import {
  IonButton,
  IonButtons,
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardSubtitle,
  IonCardTitle,
  IonCol,
  IonContent,
  IonHeader,
  IonIcon,
  IonImg,
  IonModal,
  IonRow,
  IonText,
  IonTitle,
  IonToolbar,
} from '@ionic/angular/standalone';
import { IViaje } from 'src/app/models/IViaje';
import { Subscription } from 'rxjs';
import { ViajeService } from 'src/app/services/viaje.service';
import { MapboxDirectionsResponse } from 'src/app/models/IDirection';
import { GeoJsonFeatureCollection } from 'src/app/models/IGeoJson';
import { Map as MapboxMap } from 'mapbox-gl';
import * as mapboxgl from 'mapbox-gl';
import { Feature, LineString } from 'geojson';
import { UserService } from 'src/app/services/user.service';
import { IUser } from 'src/app/models/IUser';

@Component({
  selector: 'app-mapview',
  templateUrl: './mapview.page.html',
  styleUrls: ['./mapview.page.css'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    NgxMapboxGLModule,
    IonContent,
    IonImg,
    IonCard,
    IonCardHeader,
    IonCardContent,
    IonCardTitle,
    IonCardSubtitle,
    IonModal,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonText,
    IonButtons,
    IonRow,
    IonCol,
    IonButton,
    IonIcon,
  ],
  providers: [{ provide: MAPBOX_API_KEY, useValue: '' }],
})
export class MapviewPage implements OnInit {
  @ViewChild('map') mapRef: any;
  map!: MapboxMap;

  // Services
  private _ViajeService = inject(ViajeService);
  private _userService = inject(UserService);

  // Variables
  labelLayerId?: string;
  routeGeoJson!: GeoJsonFeatureCollection;
  selectedTripId!: number;

  // Lista Viajes
  viajes: IViaje[] = [];

  // Location Vars
  centro!: LngLatLike;
  gps!: LngLatLike;
  inicio!: LngLatLike;
  destino!: LngLatLike;

  // User Vars
  user!: IUser;
  userMail?: string;
  private userSub!: Subscription;

  routeSource: any;
  routePaint: any;

  // Flags
  pcMode: boolean = true;
  openCard: boolean = false;
  isViajeActivo: boolean = !true;

  // Suscripciones
  private viajeSub!: Subscription;

  ngOnInit(): void {
    console.log('Mapa');
    this.getGPS();
    this.loadTrips();
    this.getUser();

    // Hacer consulta a Trips para traer el viaje al que esta enl user siempre que este Trip siga activo
  }

  onLoad(mapInstance: Map) {
    this.map = mapInstance;
    this.map.on('load', () => {
      console.log('Mapa Cargado Correctamente');
    });
  }

  getLabelLayerId(layers: AnyLayer[]) {
    for (const layer of layers) {
      if (layer.type === 'symbol' && layer.layout?.['text-field']) {
        return layer.id;
      }
    }
    return;
  }

  async getGPS() {
    try {
      if (!this.pcMode) {
        // GPS Android
        const permStatus = await Geolocation.checkPermissions();
        console.log('Estado de Permisos: ', permStatus.location);
        if (permStatus?.location !== 'granted') {
          const requestStatus = await Geolocation.requestPermissions();
          if (requestStatus.location !== 'granted') {
            console.warn('Permiso de GPS denegado');
            return;
          }
        }
      } else if (this.pcMode) {
        // GPS Debug PC
        if ('geolocation' in navigator) {
          navigator.geolocation.getCurrentPosition(
            (position) => {
              this.gps = {
                lat: position.coords.latitude,
                lon: position.coords.longitude,
              };
            },
            (error) => {
              console.error('Error de GPS en Web');
            }
          );
        }
      }

      const position = await Geolocation.getCurrentPosition();
      this.gps = {
        lat: position.coords.latitude,
        lon: position.coords.longitude,
      };

      // Centrado en Gps
      this.centro = this.gps;

      console.log(`GPS obtenido: ${this.gps.lat}, ${this.gps.lon}`);
    } catch (error) {
      console.error('Error obteniendo GPS:', error);
    }
  }

  // Suscripcion a GetTrips
  private loadTrips(): void {
    console.log('Hola Load');

    this.viajeSub = this._ViajeService.getTrips().subscribe({
      next: (data) => (this.viajes = data),
      error: (error) => console.error('Error fetching Viajes: ', error),
    });
  }

  // Vista de Ruta
  displayRoute(resp: MapboxDirectionsResponse) {
    if (!resp.routes.length || !resp.routes[0].geometry) {
      console.error('Error: No se encontró una ruta válida');
      return;
    }

    const newRouteData: Feature<LineString> = {
      type: 'Feature',
      properties: {},
      geometry: resp.routes[0].geometry as LineString,
    };

    const routeSource = this.map.getSource('route') as mapboxgl.GeoJSONSource;

    if (routeSource) {
      routeSource.setData(newRouteData);
    } else {
      // Si no existe, la agregamos
      this.map.addSource('route', {
        type: 'geojson',
        data: newRouteData,
      });

      this.map.addLayer({
        id: 'route-layer',
        type: 'line',
        source: 'route',
        layout: {
          'line-join': 'round',
          'line-cap': 'round',
        },
        paint: {
          'line-color': '#2E82C3',
          'line-width': 7,
        },
      });
    }
  }

  centerMap() {
    const bounds = new mapboxgl.LngLatBounds();
    bounds.extend(this.inicio);
    bounds.extend(this.destino);

    // Config Vista Ruta
    this.map.fitBounds(bounds, {
      padding: { top: 50, bottom: 50, left: 50, right: 80 },
      duration: 0,
    });
  }

  viewRouteBtn(
    initLon: number,
    initLat: number,
    endLon: number,
    endLat: number,
    index: number
  ) {
    console.log(
      `-Coordenadas del Viaje- Inicio: ${initLon}, ${initLat}, Fin:${endLon}, ${endLat}`
    );

    this._ViajeService
      .getTripDirections(initLon, initLat, endLon, endLat)
      .subscribe((response: MapboxDirectionsResponse) => {
        this.displayRoute(response);

        // Cambio de Markers
        this.inicio = { lon: initLon, lat: initLat };
        this.destino = { lon: endLon, lat: endLat };

        setTimeout(() => {
          this.centerMap();
        }, 500);

        this.selectedTripId = index;
      });
  }

  toggleCard() {
    this.openCard = !this.openCard;
  }

  joinToTrip(tripId: number, seatNumber: number, userId: number) {
    this._ViajeService.updateTrip(tripId, seatNumber, userId);
  }

  async getUser() {
    // Obtenr Sesión
    try {
      const { data, error } = await this._userService.getUsrSession();

      if (error) {
        console.log('Error al Obtener Sesión: ', error);
        return;
      }

      if (data?.user) {
        this.userMail = data.user.email;
        console.log('Email Obtenido: ', this.userMail);

        if (this.userMail) {
          this.userSub = this._userService
            .getUserData(this.userMail)
            .subscribe({
              next: (data) => {
                this.user = data;
                console.log('User ID: ', this.user.id);
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
}
