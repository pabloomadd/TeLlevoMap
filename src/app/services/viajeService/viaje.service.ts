import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { Observable } from "rxjs";
import { ViajeModel } from 'src/app/models/ViajeModel';
import { ViajeAlumnoModel } from 'src/app/models/ViajeAlumnoModel';

@Injectable({
  providedIn: 'root'
})
export class ViajeService {


    constructor(private _httpclient: HttpClient) {}

    URL_SUPABASE = 'https://oapkdozklhijkiprbmig.supabase.co/rest/v1/'
    supabaseheaders = new HttpHeaders().set('apikey', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9hcGtkb3prbGhpamtpcHJibWlnIiwicm9sZSI6ImFub24iLCJpYXQiOjE2OTcyOTU0NzcsImV4cCI6MjAxMjg3MTQ3N30.EQemub-4ElD_SeeJEor-Gmr8m-9hFpCtw5sa68yxS38')

    postNewViaje(viaje: ViajeModel): Observable<any>{
        return this._httpclient.post(this.URL_SUPABASE + 'Viaje', viaje, {headers: this.supabaseheaders, responseType: 'json'})      
    }
    
    getAllViajesConductor(conductor: any): Observable<any>{
        return this._httpclient.get<ViajeModel[]>(this.URL_SUPABASE + 'Viaje?conductor=eq.' + conductor + '&select=*', {headers: this.supabaseheaders, responseType: 'json'})
    }

    getAllViajes(): Observable<any>{
        return this._httpclient.get<ViajeModel[]>(this.URL_SUPABASE + 'Viaje', {headers: this.supabaseheaders, responseType: 'json'})
    }
 
    postViajeAlumno(viaje: ViajeAlumnoModel){
        return this._httpclient.post<ViajeAlumnoModel[]>(this.URL_SUPABASE + 'Viaje_Alumnos', viaje, {headers: this.supabaseheaders, responseType: 'json'})
    }

    getAlumnoViaje(idViaje: any): Observable<any>{
        return this._httpclient.get<any>(this.URL_SUPABASE + 'Viaje_Alumnos?idViaje=eq.'+ idViaje + '&select=idAlumno', {headers: this.supabaseheaders, responseType: 'json'})
    }
}