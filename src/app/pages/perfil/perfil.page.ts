import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  IonBackButton,
  IonButtons,
  IonCard,
  IonContent,
  IonHeader,
  IonTitle,
  IonToolbar,
} from '@ionic/angular/standalone';
import { Subscription } from 'rxjs';
import { UserService } from 'src/app/services/user.service';
import { IUser } from 'src/app/models/IUser';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.page.html',
  styleUrls: ['./perfil.page.css'],
  standalone: true,
  imports: [
    IonContent,
    IonHeader,
    IonToolbar,
    IonCard,
    IonTitle,
    IonButtons,
    IonBackButton,
    CommonModule,
    FormsModule,
    RouterModule,
  ],
})
export class PerfilPage implements OnInit {
  // Services
  private _userService = inject(UserService);

  user?: IUser;

  // Subscriptions
  private userSub!: Subscription;

  // Variables
  userMail?: string;

  constructor() {}

  ngOnInit() {
    console.log('Hola');
    this.getUser();
  }

  async getUser() {
    // Obtenr Sesión
    try {
      const { data, error } = await this._userService.getUsrSession();

      if (error) {
        console.log('Error al Obtener Sesión: ', error);
        return;
      }

      if (data?.user) {
        this.userMail = data.user.email;
        console.log('Email Obtenido: ', this.userMail);

        if (this.userMail) {
          this.userSub = this._userService
            .getUserData(this.userMail)
            .subscribe({
              next: (data) => {
                if (data) {
                  this.user = data;
                  console.log('Datos del Usuario Obtenidos: ', this.user);
                } else {
                  console.log('No se enocntraron datos de ese usuario');
                }
              },

              error: (error) =>
                console.log('Error Obteniendo UserData: ', error),
            });
        }
      } else {
        console.log('No hay Usuario Autenticado');
      }
    } catch (error) {
      console.log('Algo salio mal: ', error);
    }
  }
}
