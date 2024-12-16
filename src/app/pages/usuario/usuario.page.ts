import { Component, ViewChild, ElementRef, OnInit } from '@angular/core';
import { IonModal, IonicModule } from '@ionic/angular';
import { AlertController } from '@ionic/angular';
import { AnimationController, IonCard } from '@ionic/angular';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { UserModel } from '../../models/UserModel';
import { Subscription, lastValueFrom, Observable } from 'rxjs';
import { Preferences } from '@capacitor/preferences';
import { UserService } from '../../services/user.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IUserLogin } from '../../models/IUserLogin';
import { HttpClientModule } from '@angular/common/http';
import { ViajeModel } from '../../models/ViajeModel';
import { ViajeService } from '../../services/viaje.service'
import { ViajeAlumnoModel } from '../../models/ViajeAlumnoModel';
import { OverlayEventDetail } from '@ionic/core/components';

@Component({
  selector: 'app-usuario',
  templateUrl: 'usuario.page.html',
  styleUrls: ['usuario.page.css'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule, HttpClientModule],
  providers: [ViajeService, UserService]
})

export class UsuarioPage implements OnInit {

  user!: number
  name!: string;
  id_viaje!: number
  userInfoReceived: UserModel;

  @ViewChild(IonModal) modal!: IonModal;
  message = 'This modal example uses triggers to automatically open a modal';
  viajes: any
  viajeAlumno: ViajeAlumnoModel = {
    idViaje: this.id_viaje,
    idAlumno: this.user
  }

  viaje: ViajeModel = {
    id: this.id_viaje,
    nombre: '',
    conductor: this.user,
    cantAsientosDisp: 0,
    lugarInicio: '',
    lugarDestino: '',
    estado: 1
  };

  constructor(private router: Router, private _userService: UserService, private _viajeService: ViajeService) {
    this.userInfoReceived = this.router.getCurrentNavigation()?.extras.state?.['userInfo'];
    this.user = this.userInfoReceived.id
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

  async getViaje() {
    this.viajes = await lastValueFrom(this._viajeService.getAllViajes());
    console.log("listaViajes:", this.viajes)
  }

  async addAlumno(viaje: ViajeModel) {
    this.modal.dismiss(this.name, 'confirm');
    console.log("InfoViaje:", viaje)
    this.viajeAlumno.idViaje = viaje.id
    this.viajeAlumno.idAlumno = this.user
    console.log("IdViaje:", this.viajeAlumno.idViaje)
    console.log("IdAlumno:", this.viajeAlumno.idAlumno)
    console.log("viajealumno:", this.viajeAlumno)
    const response = await lastValueFrom(this._viajeService.postViajeAlumno(this.viajeAlumno));
    console.log("response:", response)
  }

  confirm() {
    this.modal.dismiss(this.name, 'confirm');
  }

  cancel() {
    this.modal.dismiss(null, 'cancel');
  }

  onWillDismiss(event: Event) {
    const ev = event as CustomEvent<OverlayEventDetail<string>>;
    if (ev.detail.role === 'confirm') {
      this.message = `Hello, ${ev.detail.data}!`;
    }
  }


  irHome() {
    this.router.navigate(['/home'], { state: { userInfo: this.userInfoReceived } })
  }

  irMaps() {
    this.router.navigate(['/maps'], { state: { userInfo: this.userInfoReceived } })
  }


}
