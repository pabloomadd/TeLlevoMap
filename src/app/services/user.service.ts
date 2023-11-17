import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { UserModel } from '../models/UserModel';
import { Observable } from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class UserService {

  URL_SUPABASE = 'https://oapkdozklhijkiprbmig.supabase.co/rest/v1/'


  constructor(private _httpclient: HttpClient) {

  }

  supabaseheaders = new HttpHeaders()
    .set('apikey', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9hcGtkb3prbGhpamtpcHJibWlnIiwicm9sZSI6ImFub24iLCJpYXQiOjE2OTcyOTU0NzcsImV4cCI6MjAxMjg3MTQ3N30.EQemub-4ElD_SeeJEor-Gmr8m-9hFpCtw5sa68yxS38')

  getUserListSupaBase(): Observable<UserModel[]> {
    console.log(this.supabaseheaders);
    return this._httpclient.get<UserModel[]>(this.URL_SUPABASE, { headers: this.supabaseheaders, responseType: 'json' });
  }

  getUser(user_id: string): Observable<UserModel>{
    return this._httpclient.get<UserModel>(this.URL_SUPABASE+'User?id=eq.'+ user_id + '&select=*',{ headers: this.supabaseheaders, responseType: 'json' });
  }

  getUserName(user_id: number): Observable<any>{
    return this._httpclient.get<any>(this.URL_SUPABASE+'User?id=eq.'+ user_id + '&select=name', { headers: this.supabaseheaders, responseType: 'json' });
  }

  getLoginUser(username: string, password: string): Observable<UserModel[]>{
    return this._httpclient.get<UserModel[]>(this.URL_SUPABASE+'User?select=id,name,last_name,username,password,email,type&username=eq.'+ username +'&password=eq.'+ password,{ headers: this.supabaseheaders, responseType: 'json' });
  } 
  
  getUserType(user_id: number): Observable<any>{
    console.log("getUser:", user_id)
    return this._httpclient.get<any>(this.URL_SUPABASE+"User?id=eq."+user_id+ "&select=type", { headers: this.supabaseheaders, responseType: 'json' });
  }


}

