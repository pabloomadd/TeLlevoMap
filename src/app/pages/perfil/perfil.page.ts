import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import {
  IonBackButton,
  IonButton,
  IonButtons,
  IonCard,
  IonCardContent,
  IonCol,
  IonContent,
  IonHeader,
  IonIcon,
  IonInput,
  IonItem,
  IonRow,
  IonText,
  IonTitle,
  IonToast,
  IonToolbar,
} from '@ionic/angular/standalone';
import { Subscription } from 'rxjs';
import { UserService } from 'src/app/services/user.service';
import { IUser, Vehicle } from 'src/app/models/IUser';
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
    IonCardContent,
    IonRow,
    IonCol,
    IonText,
    IonIcon,
    IonButton,
    IonTitle,
    IonButtons,
    IonBackButton,
    IonItem,
    IonInput,
    IonToast,
    CommonModule,
    FormsModule,
    RouterModule,
    ReactiveFormsModule,
  ],
})
export class PerfilPage implements OnInit {
  // Services
  private _userService = inject(UserService);

  user!: IUser;
  vehicle!: Vehicle;

  // Subscriptions
  private userSub!: Subscription;
  private vehicleSub!: Subscription;

  // Variables
  userMail?: string;
  msg!: string;

  // Flags
  isEditPInfo: boolean = false;
  isEditVehInfo: boolean = false;
  isToastOpen!: boolean;

  // Forms
  personalForm!: FormGroup;
  vehicleForm!: FormGroup;

  constructor(private formBuilder: FormBuilder) {
    this.personalForm = formBuilder.group({
      name: ['', [Validators.required]],
      lastname: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
    });

    this.vehicleForm = formBuilder.group({
      brand: ['', Validators.required],
      model: ['', Validators.required],
      licPlate: ['', Validators.required],
      year: ['', Validators.required],
      color: ['', Validators.required],
    });
  }

  ngOnInit() {
    console.log('isEditPInfo al iniciar:', this.isEditPInfo);
    // Incializar Forms
    this.personalForm.disable();
    this.vehicleForm.disable();

    this.getUser();
  }

  //Obtener Datos User
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
                this.user = data;
                console.log('User ID: ', this.user.id);

                // Datos Personales
                this.personalForm.patchValue({
                  name: this.user.name,
                  lastname: this.user.lastname,
                  email: this.user.email,
                });

                if (this.isDriver) {
                  // Funcion para Obtener Vehiculo
                  this.vehicleSub = this._userService
                    .getVehiData(this.user.id)
                    .subscribe({
                      next: (data) => {
                        this.vehicle = data;

                        // Datos Vehiculo
                        this.vehicleForm.patchValue({
                          brand: this.vehicle.brand,
                          model: this.vehicle.model,
                          licPlate: this.vehicle.licPlate,
                          year: this.vehicle.year,
                          color: this.vehicle.color,
                        });
                      },
                    });
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

  get isDriver(): boolean {
    return this.user?.usrType === 'driver';
  }

  getVehiData(userId: number) {
    return this._userService.getVehiData(userId);
  }

  editPerInfo() {
    console.log('Editando Personal Info');
    this.isEditPInfo = true;
    this.personalForm.enable();
  }

  updatePerInfo() {
    this._userService
      .updateUserData(
        this.user.email,
        this.personalForm.value.name,
        this.personalForm.value.lastname,
        this.personalForm.value.email
      )
      .then(() => {
        this.editMsg('Usuario Actualizado con Éxito', true);
      })
      .catch((error) => {
        console.log('Error al Actualizar PerInfo: ', error);
        this.editMsg('Error al Actualizar Usuario', true);
      })
      .finally(() => {
        setTimeout(() => {
          this.isEditPInfo = false;
          this.personalForm.disable();
        }, 500);
      });
  }

  cancelPerEdit() {
    console.log('Editando Personal Info Cancelado');
    this.isEditPInfo = false;
    this.personalForm.disable();
  }

  editVehInfo() {
    console.log('Editando Vehicle Info');
    this.isEditVehInfo = true;
    this.vehicleForm.enable();
  }

  updateVehInfo() {
    this._userService
      .updateVehData(
        this.user.id,
        this.vehicleForm.value.brand,
        this.vehicleForm.value.model,
        this.vehicleForm.value.year,
        this.vehicleForm.value.licPlate,
        this.vehicleForm.value.color
      )
      .then(() => {
        this.editMsg('Vehículo Actualizado con Éxito', true);
      })
      .catch((error) => {
        console.log('Error al Actualizar VehInfo: ', error);
        this.editMsg('Error al Actualizar Vehículo', true);
      })
      .finally(() => {
        setTimeout(() => {
          this.isEditVehInfo = false;
          this.vehicleForm.disable();
        }, 500);
      });
  }

  cancelVehEdit() {
    console.log('Editando Vehicle Info');
    this.isEditVehInfo = false;
    this.vehicleForm.disable();
  }

  editMsg(message: string, toast: boolean) {
    this.msg = message;

    // Reinicio del Toast
    this.isToastOpen = false;

    setTimeout(() => {
      this.isToastOpen = toast;
    }, 100);
  }

  // Toast Feed para User y Vehicle Update
}
