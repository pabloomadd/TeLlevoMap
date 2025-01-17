import { Component, inject, OnInit } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { UserService } from '../../services/user.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ViajeService } from '../../services/viaje.service';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-usuario',
  templateUrl: 'usuario.page.html',
  styleUrls: ['usuario.page.css'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule, RouterModule],
  providers: [ViajeService, UserService],
})
export class UsuarioPage implements OnInit {
  _userService = inject(UserService);
  _router = inject(Router);

  constructor() {}

  ngOnInit() {
    console.log('Hola Usuario');
  }

  getInfo() {}

  logOut() {
    console.log('Cerrando Sesión...');
    this._userService.logOut();
    localStorage.clear(); //Limpeiza de localStorage
    window.location.reload(); //Fuerza la recarga
  }
}
