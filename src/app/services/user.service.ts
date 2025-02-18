import { Injectable } from '@angular/core';
import { BehaviorSubject, lastValueFrom, Observable } from 'rxjs';
import { environment } from 'src/environments/environment.development';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { IUser, Vehicle } from '../models/IUser';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private supabase: SupabaseClient;

  private authState = new BehaviorSubject<boolean>(false);
  isAuth$ = this.authState.asObservable();

  // Supabase Client
  constructor() {
    this.supabase = createClient(environment.SupaUrl, environment.SupaK);
  }

//USER FUNcTIONS

  //Crud Usuario

  createUser(email: string, password: string) {
    return this.supabase.auth.signUp({ email, password });
  }

  creatUsrData(usr: {
    name: string;
    lastname: string;
    email: string;
    usrType: string;
  }): Observable<IUser[]> {
    return new Observable((observer) => {
      this.supabase
        .from('user')
        .insert([usr])
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

  getUserData(email: string): Observable<IUser> {
    return new Observable((observer) => {
      this.supabase
        .from('user')
        .select(
          `*,
          activeTrip(*,start(*),end(*))`
        )
        .eq('email', email)
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

  async updateUserData(
    email: string,
    name: string,
    lastname: string,
    newEmail: string
  ): Promise<any> {
    try {
      const { data, error } = await this.supabase
        .from('user')
        .update({ name, lastname, email: newEmail })
        .eq('email', email);

      if (error) {
        console.error('Error al Actualizar Usuario: ', error);
        throw error;
      }

      return data;
    } catch (err) {
      console.error('Error inesperado:', err);
      throw err;
    }
  }

  logOut() {
    return this.supabase.auth.signOut().then(() => {
      this.authState.next(false);
    });
  }

  //UserTrip Functions
  async addTripToUser(userId: number, tripId: number) {
    try {
      const { data, error } = await this.supabase
        .from('user')
        .update({ activeTrip: tripId })
        .eq('id', userId);

      if (error) {
        console.error('Error al Agregar Usuario al Trip: ', error);
        throw error;
      }
    } catch (err) {
      console.error('Error Inesperado al Agregar Uusario al Trip: ', err);
      throw err;
    }
  }

  async deleteTripFromUser(userId: number) {
    try {
      const { data, error } = await this.supabase
        .from('user')
        .update({ activeTrip: null })
        .eq('id', userId);

      if (error) {
        console.error('Error al Quitar Viaje del Usuario: ', error);
        throw error;
      }
    } catch (err) {
      console.error('Error Inesperado al Quitar Viaje: ', err);
      throw err;
    }
  }


//VERIFICACIONES

  // Obtener Sesion
  getUsrSession() {
    return this.supabase.auth.getUser();
  }

  // Usuario Existente?
  verifUserExist(email: string): Promise<boolean> {
    return new Promise((resolve, reject) => {
      this.supabase
        .from('user')
        .select('email')
        .eq('email', email)
        .then(({ data, error }) => {
          if (error) {
            reject(error);
          } else {
            resolve(data.length > 0); // Retorna true si existe, false si no
          }
        });
    });
  }

  // Manejo de Sesion
  logInWEmail(email: string, password: string) {
    return this.supabase.auth
      .signInWithPassword({ email, password })
      .then((response) => {
        if (response.error) {
          throw new Error(response.error.message);
        }
        console.log('Response: ', response);
        this.authState.next(true);
        return response;
      });
  }


// VEHICLE FUNCIONS

  // Vehicle Crud

  // Funcion Create Vehicle

  getVehiData(userId: number): Observable<Vehicle> {
    return new Observable((observer) => {
      this.supabase
        .from('vehicle')
        .select('*')
        .eq('user_id', userId)
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

  async updateVehData(
    userId: number,
    brand: string,
    model: string,
    year: string,
    licPlate: string,
    color: string
  ): Promise<any> {
    try {
      const { data, error, count } = await this.supabase
        .from('vehicle')
        .update({ brand, model, year, licPlate, color })
        .eq('user_id', userId);

      if (error) {
        console.error('Error al Actualizar Vehiculo: ', error);
        throw error;
      }

      console.log('Filas afectadas:', count);

      return data;
    } catch (err) {
      console.error('Error inesperado:', err);
      throw err;
    }
  }
}
