import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { Router, RouterLink } from '@angular/router';
import { UserService } from 'src/app/services/user.service';
import { Observable } from 'rxjs';
import { HttpClientModule } from '@angular/common/http';
import { UserModel } from '../models/UserModel';
import { Geolocation } from '@capacitor/geolocation';

declare var google: any;

interface Marker {
  position: {
    lat: number,
    lng: number,
  };
  title: string;
}

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, RouterLink, FormsModule, HttpClientModule],
  providers: [UserService]
})
export class HomePage implements OnInit {

  locaMap = null;

  centro = {
    lat: -33.02254395854375,
    lng: -71.55173445693278
  }

  user: UserModel;
  constructor(private router: Router,private _userService: UserService) { 
    this.user = this.router.getCurrentNavigation()?.extras.state?.['userInfo'];
    console.log("user id:", this.user.id)
    console.log("state:", this.router.getCurrentNavigation()?.extras.state)
  }

  ngOnInit() {
    console.log(this.user.id);
    this.loadMap();
  }

  sendPage(){
    this._userService.getUserType(this.user.id).subscribe(type =>{
      console.log("usertype:", type[0].type);
      if (type[0].type == 1){
        this.router.navigate(['/admin'], { state: {userInfo: this.user}})
      } else {
        this.router.navigate(['/usuario'], {state: {userInfo: this.user}})
      }
    })
  }
  cerrarSesion(){
    this.router.navigate(['/login'])

  }

  loadMap() {
    // Crea un nuevo mapa pasandolo como HTMLElement
    const mapEle: HTMLElement | null = document.getElementById('locationMap');

    if (mapEle) {
      // Se crea el mapa solo si es encontrado
      this.locaMap = new google.maps.Map(mapEle, {
        center: this.centro,
        zoom: 12
      });

      google.maps.event.addListenerOnce(this.locaMap, 'idle', () => {
        mapEle.classList.add('show-map');
        
      });
    } else {
      console.error('Map element not found');
    }
  }

  addMarker(marker: Marker) {
    return new google.maps.Marker({
      position: marker.position,
      map: this.locaMap,
      title: marker.title
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
        enableHighAccuracy: true
      };
      const position = await Geolocation.getCurrentPosition(options);
      console.log(position);

      const marker = {
        position: {
          lat: position.coords.latitude,
          lng: position.coords.longitude
        },
        title: 'Mi Ubicacion'
      };
      

      const newCentro = {
        lat: position.coords.latitude,
        lng: position.coords.longitude
      }

      this.centro = newCentro;
      
      this.loadMap();
      this.addMarker(marker);

    } catch (error) {
      console.log(error);
      throw(error);
      
    }
  }

  

}
