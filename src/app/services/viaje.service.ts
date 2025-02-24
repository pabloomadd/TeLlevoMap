import { Injectable } from '@angular/core';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { from, Observable } from 'rxjs';
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

  getDriverTrip(userId: number): Observable<IViaje> {
    return new Observable((observer) => {
      this.supabase
        .from('trip')
        .select('*')
        .eq('driver', userId)
        .single()
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

  getDriverIdTrip(userId: number): Observable<any> {
    return new Observable((observer) => {
      this.supabase
        .from('trip')
        .select('id')
        .eq('driver', userId)
        .single()
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

  async updateTrip(
    tripId: number,
    seatNumber: number,
    userId: number
  ): Promise<any> {
    try {
      const seatField = `seat${seatNumber}`;

      const { data, error } = await this.supabase
        .from('trip')
        .update({ [seatField]: userId })
        .eq('id', tripId);

      if (error) {
        console.log(`Error al Actualizar Viaje de Id: ${tripId}, ${error}`);
        throw error;
      }
    } catch (err) {
      console.error('Error inesperado al Actualizar Viaje: ', err);
      throw err;
    }
  }

  async cancelTrip(tripId: number, seatNumber: number) {
    try {
      const seatField = `seat${seatNumber}`;

      const { data, error } = await this.supabase
        .from('trip')
        .update({ [seatField]: null })
        .eq('id', tripId);

      if (error) {
        console.log('Error al borrar UserId en ', seatField);
        throw error;
      }
    } catch (err) {
      console.error('Error Inesperado al Borrar UserId de Trip');
      throw err;
    }
  }

  async setSeatLocation(
    tripId: number,
    seatNumber: number,
    seatLocation: number[]
  ) {
    try {
      const seatLocField = `seat${seatNumber}Loc`;

      const { data, error } = await this.supabase
        .from('trip')
        .update({ [seatLocField]: seatLocation })
        .eq('id', tripId);

      if (error) {
        console.log('Error al Actualizar SeatLocation: ', error);
        throw error;
      }
    } catch (err) {
      console.error('Error Inesperado al Actualizar SeatLocation: ', err);
      throw err;
    }
  }

  getSeatLocation(tripId: number, seatNumber: number): Observable<any[]> {
    const seatField = `seat${seatNumber}Loc`;

    return from(
      this.supabase
        .from('trip')
        .select(seatField)
        .eq('id', tripId)
        .then(({ data, error }) => {
          if (error) {
            console.log('Error al Obtener SeatLocation: ', error);
            throw error;
          }
          return Array.isArray(data) ? data : [data];
        })
    );
  }

  async deleteSeatLocation(tripId: number, seatNumber: number) {
    try {
      const seatLocField = `seat${seatNumber}Loc`;

      const { data, error } = await this.supabase
        .from('trip')
        .update({ [seatLocField]: null })
        .eq('id', tripId);

      if (error) {
        console.log('Error al Eliminar SeatLocation: ', error);
        throw error;
      }
    } catch (err) {
      console.error('Error Inesperado al Eliminar SeatLocation: ', err);
      throw err;
    }
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
