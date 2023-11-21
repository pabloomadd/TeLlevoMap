import { Component, CUSTOM_ELEMENTS_SCHEMA, ViewChild, ElementRef, OnInit} from '@angular/core';
import { IonModal, IonicModule } from '@ionic/angular';
import { AlertController } from '@ionic/angular';
import { ActivatedRoute, Router, RouterLink} from '@angular/router';
import { UserModel } from '../models/UserModel';
import { Subscription, lastValueFrom } from 'rxjs';
import { Preferences } from '@capacitor/preferences';
import { UserService } from '../services/user.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { ViajeModel } from '../models/ViajeModel';
import { ViajeService } from '../services/viajeService/viaje.service'
import { OverlayEventDetail } from '@ionic/core/components';
import { GoogleMap } from '@capacitor/google-maps';
import { environment } from 'src/environments/environment';




@Component({
  selector: 'app-admin',
  templateUrl: 'admin.page.html',
  styleUrls: ['admin.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, RouterLink, FormsModule, HttpClientModule],
  providers: [ViajeService, UserService],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class AdminPage implements OnInit {
  
  @ViewChild ('map')
  mapRef!: ElementRef<HTMLElement>;
  newMap!: GoogleMap;
  

  @ViewChild (IonModal) modal!: IonModal;

  message = 'This modal example uses triggers to automatically open a modal';
  user!: number;
  name!: string;
  id_viaje!: number;
  conductor!: any;
  viajes: any;
  viaje: ViajeModel = {
    id: this.id_viaje,
    nombre: '',
    conductor: this.user,
    cantAsientosDisp: 0,
    lugarInicio: '',
    lugarDestino: '',
    estado: 1
  };


  userInfoReceived: UserModel;
  idUserHtmlRouterLink: any;

  public userExists?: UserModel;
  public userList$!: Subscription;
  public userList: UserModel[] = [];

  constructor( private router: Router, private activatedRoute: ActivatedRoute, private _usuarioService: UserService, private _viajeService: ViajeService, private alertController: AlertController) {
    this.userInfoReceived = this.router.getCurrentNavigation()?.extras.state?.['userInfo'];
    this.user = this.userInfoReceived?.id
    console.log("user id:", this.user)
    console.log("state:", this.router.getCurrentNavigation()?.extras.state)
  }

  ngOnDestroy(): void {
    throw new Error('Method not implemented.');
  } 

  ngOnInit() {
      this.getViaje();
  }

  async setObject(viaje: ViajeModel) {
    await Preferences.set({
      key: 'viaje',
      value: JSON.stringify(viaje)
    });
  }


//Función obtener viajes
  async getViaje(){
    const nombres = []
    this.viajes = await lastValueFrom(this._viajeService.getAllViajesConductor(this.userInfoReceived?.id));
    for (const viaje of this.viajes){
     let alumnos = await lastValueFrom(this._viajeService.getAlumnoViaje(viaje.id))
     viaje.alumnos = alumnos
     console.info("ViajeAlumnos:", viaje.alumnos)
    
      for (const alumnos of viaje.alumnos){
        let name = await lastValueFrom(this._usuarioService.getUserName(alumnos.idAlumno))
        alumnos.name = name[0]
        console.log("NombresAlumnos:", alumnos.name)
        nombres.push(alumnos.name)
        viaje.alumnos = nombres
        console.log("ListaNombres:", viaje.alumnos)
      }
      
    }   
}  

//Funcion Guardar nuevo Viaje  
  async newViaje(nuevoViaje : ViajeModel){
    nuevoViaje.conductor = this.user
    console.info("nuevo viaje", nuevoViaje)
    this.modal.dismiss(this.name, 'confirm');
    const response = await lastValueFrom(this._viajeService.postNewViaje(nuevoViaje));
    console.log(response)
    this.getViaje();
  
  }

  confirm() {
    this.modal.dismiss(this.name, 'confirm');
  }

  cancel(){
    this.modal.dismiss(null, 'cancel');
  }

  onWillDismiss(event: Event) {
    const ev = event as CustomEvent<OverlayEventDetail<string>>;
    if (ev.detail.role === 'confirm') {
      this.message = `Hello, ${ev.detail.data}!`;
    }
  }

  cerrarSesion(){
    this.router.navigate(['/login'])
  }

  irHome(){
    this.router.navigate(['/home'], { state: {userInfo: this.userInfoReceived}})
  }

  //GoogleMaps
  async createMap() {
    this.newMap = await GoogleMap.create({
      id: 'my-map',
      element: this.mapRef.nativeElement,
      apiKey: environment.mapsKeys,
      config: {
        center: {
          lat: -33.04005395849287,
          lng: -71.49137532175799,
        },
        zoom: 11,
      },
    });

    this.addMarkInicio();
    this.addMarkFin();
  }

  async mapDestroy(){
    await this.newMap.destroy();
  }

  async addMarkInicio(){
    const markerId = await this.newMap.addMarker({
      coordinate: {
        lat: -33.0336435711753,
        lng: -71.5331795329938,
      },
      title: 'DUOC Viña del Mar',
      snippet: 'DUOC'
    })

  }

  async addMarkFin(){
    const markerId = await this.newMap.addMarker({
      coordinate: {
        lat: -33.0481265544542,
        lng: -71.4408920089665,
      },
      title: 'Centro de Quilpue'
    })

  }

      
}
