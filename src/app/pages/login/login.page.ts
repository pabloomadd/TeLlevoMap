import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { Router, RouterModule } from '@angular/router';
import { UserService } from 'src/app/services/user.service';
import { environment } from 'src/environments/environment.development';
import { GlobalService } from 'src/app/services/global.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.css'],
  standalone: true,
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
  ],
})
export class LoginPage implements OnInit {
  // Services
  private _userService = inject(UserService);
  private _router = inject(Router);
  private _globalService = inject(GlobalService);

  // Flags
  logging: boolean = false;

  // Forms
  logForm!: FormGroup;

  // Action Sheet Btns
  public demoSheetBtns = [
    {
      text: 'Pasajero',
      data: {
        action: 'passe',
      },
    },
    {
      text: 'Conductor',

      data: {
        action: 'driver',
      },
    },
    {
      text: 'Cancelar',
      role: 'cancel',
      data: {
        action: 'cancel',
      },
    },
  ];

  date = new Date();
  annio?: number;

  constructor(private formBuilder: FormBuilder) {
    this.logForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      pass: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  ngOnInit() {
    this.getCurrentYear();
  }

  // Lógica Login
  async logIn() {
    this.logging = true;
    try {
      // Loguear
      const loginResp = await this._userService.logInWEmail(
        this.logForm.value.email,
        this.logForm.value.pass
      );
      console.log('Logueo con Éxito');
      this._globalService.showLoading();
      this._router.navigate(['/mapview']);
    } catch (error) {
      console.error('Error en Proceso de Login: ', error);
    } finally {
      this.logForm.reset();
      this.logging = false;
    }
  }

  openDemoSheet() {
    const actionSheet = document.querySelector('ion-action-sheet');
    actionSheet?.present();
  }

  demoSheetAction(event: any) {
    try {
      const action = event.detail.data?.action;

      if (action === 'cancel') {
        console.log('Cancelado');
      } else {
        let userDemo = '';
        let passDemo = '';
        if (action === 'passe' || action === 'driver') {
          if (action === 'passe') {
            console.log('Pasajero');
            userDemo = environment.user1;
            passDemo = environment.user2;
          } else {
            console.log('Conductor');
            userDemo = environment.user3;
            passDemo = environment.user4;
          }

          this.logForm.patchValue({
            email: userDemo,
            pass: passDemo,
          });

          this.logIn();
          this._globalService.showLoading();
        }
      }
    } catch (error) {
      console.log('Error al Ingresar como Invitado');
    }
  }

  formValidError(controlName: string, errorType: string) {
    return (
      this.logForm.get(controlName)?.hasError(errorType) &&
      this.logForm.get(controlName)?.touched
    );
  }

  getCurrentYear() {
    this.annio = this.date.getFullYear();
  }
}
