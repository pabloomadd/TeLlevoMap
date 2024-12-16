import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-registro',
  templateUrl: './registro.page.html',
  styleUrls: ['./registro.page.css'],
  standalone: true,
  imports: [IonicModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule
  ]
})
export class RegistroPage {

  constructor(private router: Router) { }

  goLogin() {
    this.router.navigate(['/login'])
  }


}
