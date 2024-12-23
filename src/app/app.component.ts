import { Component, } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { MobnavComponent } from './components/mobnav/mobnav.component';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.css'],
  standalone: true,
  imports: [IonicModule, MobnavComponent],
  
})

export class AppComponent {

  constructor() {}
}
