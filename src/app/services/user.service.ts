import { Injectable } from '@angular/core';
import { BehaviorSubject, lastValueFrom, Observable } from 'rxjs';
import { environment } from 'src/environments/environment.development';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { IUser } from '../models/IUser';

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

  // Nuevo Usuario
  createUser(email: string, password: string) {
    return this.supabase.auth.signUp({ email, password });
  }

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

  logOut() {
    return this.supabase.auth.signOut().then(() => {
      this.authState.next(false);
    });
  }

  //DB Crud
  //Crear Usuario
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
}
