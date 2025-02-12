import { Injectable } from '@angular/core';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { Observable } from 'rxjs';
import { ILocation, IViaje } from 'src/app/models/IViaje';
import { environment } from 'src/environments/environment.development';
import { MapboxDirectionsResponse } from '../models/IDirection';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class ViajeService {
  private supabase: SupabaseClient;

  private urlDirections = 'https://api.mapbox.com/directions/v5/mapbox/driving';
  private mapTk = environment.map;

  // Supabase Client
  constructor(private http: HttpClient) {
    this.supabase = createClient(environment.SupaUrl, environment.SupaK);
  }

  // CRUD Viajes
  // Obtener Todos Viajes
  getTrips(): Observable<IViaje[]> {
    return new Observable((observer) => {
      this.supabase
        .from('trip')
        .select(
          `*,
          start(*),
          end(*)`
        )
        .then(({ data, error }) => {
          if (error) {
            observer.error(error);
          } else {
            observer.next(data || []);
          }
          observer.complete();
        });
    });
  }

  getTripDirections(
    initLon: number,
    initLat: number,
    endLon: number,
    endLat: number
  ): Observable<MapboxDirectionsResponse> {
    const url = `${this.urlDirections}/${initLon},${initLat};${endLon},${endLat}?geometries=geojson&access_token=${environment.map}`;

    console.log('URL Generada: ', url);

    return this.http.get<MapboxDirectionsResponse>(url);
  }

  postTrip(viaje: IViaje): Observable<IViaje[]> {
    return new Observable((observer) => {
      this.supabase
        .from('trip')
        .insert([viaje])
        .then(({ data, error }) => {
          if (error) {
            observer.error(error);
          } else {
            observer.next(data || []);
          }
          observer.complete();
        });
    });
  }

  // Supa Locations
  getLocations(): Observable<ILocation[]> {
    return new Observable((observer) => {
      this.supabase
        .from('location')
        .select(`*`)
        .then(({ data, error }) => {
          if (error) {
            observer.error(error);
          } else {
            observer.next(data || []);
          }
          observer.complete();
        });
    });
  }
}
