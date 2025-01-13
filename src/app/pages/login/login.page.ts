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

  // Flags
  logging: boolean = false;

  // Forms
  logForm!: FormGroup;

  constructor(private formBuilder: FormBuilder) {
    this.logForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      pass: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  ngOnInit() {
    console.log('Hola Login');
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

      this._router.navigate(['/mapview']);
    } catch (error) {
      console.error('Error en Proceso de Login: ', error);
    } finally {
      this.logForm.reset();
      this.logging = false;
    }
  }

  formValidError(controlName: string, errorType: string) {
    return (
      this.logForm.get(controlName)?.hasError(errorType) &&
      this.logForm.get(controlName)?.touched
    );
  }
}
