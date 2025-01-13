import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { RouterModule } from '@angular/router';
import { UserService } from 'src/app/services/user.service';
import { IonInputPasswordToggle, IonToast } from '@ionic/angular/standalone';

@Component({
  selector: 'app-registro',
  templateUrl: './registro.page.html',
  styleUrls: ['./registro.page.css'],
  standalone: true,
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
    IonInputPasswordToggle,
    IonToast,
  ],
})
export class RegistroPage {
  // Services
  private _usrService = inject(UserService);

  // Forms
  regForm!: FormGroup;

  // Flags
  registering: boolean = false;
  isToastOpen!: boolean;

  //Msg
  msg!: string;

  constructor(private formBuilder: FormBuilder) {
    this.regForm = this.formBuilder.group({
      name: ['', Validators.required],
      lastname: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      pass: ['', [Validators.required, Validators.minLength(6)]],
      usrType: ['', Validators.required],
    });
  }

  async regUser() {
    this.registering = true;

    try {
      const userExists = await this.checkUserExist(this.regForm.value.email);

      if (userExists) {
        this.alertMsg('El usuario ya existe', true);
        console.log('El usuario ya está registrado. Proceso detenido.');

        return;
      }

      // Continuar con el registro
      console.log('El usuario no está registrado. Procediendo al registro...');

      // Registro en Auth
      const usrResp = await this._usrService.createUser(
        this.regForm.value.email,
        this.regForm.value.pass
      );
      console.log('Usuario Registrado ', usrResp);

      // Registro en Base de Datos
      await this.saveUsrData();
      console.log('Usuario registrado exitosamente.');
      this.regForm.reset();
      this.alertMsg('Usuario Registrado con Éxito', true);
    } catch (error) {
      console.error('Error en Proceso de Registro:', error);
    } finally {
      this.registering = false;
    }
  }

  formValidError(controlName: string, errorType: string) {
    return (
      this.regForm.get(controlName)?.hasError(errorType) &&
      this.regForm.get(controlName)?.touched
    );
  }

  saveUsrData() {
    // Nuevo Objeto sin pass
    const { pass, ...userData } = this.regForm.value;

    // Crear Usuario
    this._usrService.creatUsrData(userData).subscribe({
      next: (data) => {
        console.log('Pasajero Creado: ', this.regForm.value.name);
      },
      error: (error) => {
        console.error('Error al Agregar Pasajero: ', error);
      },
      complete: () => console.log('Inserción Completa'),
    });
  }

  async checkUserExist(email: string): Promise<boolean> {
    try {
      const exists = await this._usrService.verifUserExist(email);
      return exists;
    } catch (error) {
      console.error('Error al verificar usuario:', error);
      return false;
    }
  }

  alertMsg(message: string, toast: boolean) {
    this.msg = message;

    // Forzar Reinicio del Toast
    this.isToastOpen = false;

    setTimeout(() => {
      this.isToastOpen = toast;
    }, 100);
  }
}
