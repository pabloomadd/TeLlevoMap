import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { IonicModule } from '@ionic/angular';

@Component({
  selector: 'app-mobnav',
  templateUrl: './mobnav.component.html',
  styleUrls: ['./mobnav.component.css'],
  standalone: true,
  imports: [IonicModule, RouterModule],
})
export class MobnavComponent {}
