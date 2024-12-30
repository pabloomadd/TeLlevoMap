import { Injectable } from '@angular/core';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { Observable } from 'rxjs';
import { IViaje } from 'src/app/models/IViaje';
import { environment } from 'src/environments/environment.development';

@Injectable({
  providedIn: 'root',
})
export class ViajeService {
  private supabase: SupabaseClient;

  // Supabase Client
  constructor() {
    this.supabase = createClient(environment.SupaUrl, environment.SupaK);
  }

  // CRUD Supa Viajes
  getTrips(): Observable<IViaje[]> {
    return new Observable((observer) => {
      this.supabase
        .from('trip')
        .select(
          `*,
          start(name),
          end(name)`
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

  postTrip(viaje: {
    nombre: string;
    seat1: boolean | null;
    seat2: boolean | null;
    seat3: boolean | null;
    seat4: boolean | null;
    start: string;
    end: string;
    driver: string;
  }): Observable<any> {
    return new Observable((observer) => {
      this.supabase
        .from('trip')
        .insert([viaje])
        .then(({ data, error }) => {
          if (error) {
            observer.error(error);
          } else {
            observer.next(data);
          }
          observer.complete();
        });
    });
  }
}
