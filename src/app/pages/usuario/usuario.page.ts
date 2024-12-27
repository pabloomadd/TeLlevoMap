import { Component, OnInit } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { UserService } from '../../services/user.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ViajeService } from '../../services/viaje.service'


@Component({
  selector: 'app-usuario',
  templateUrl: 'usuario.page.html',
  styleUrls: ['usuario.page.css'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule],
  providers: [ViajeService, UserService]
})

export class UsuarioPage implements OnInit {

  constructor() {

  }

  ngOnInit() {
    console.log("Hola Usuario")
  }

  getInfo() {

  }

}
