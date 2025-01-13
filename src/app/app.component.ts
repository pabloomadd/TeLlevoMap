import { Component, OnDestroy, OnInit } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { MobnavComponent } from './components/mobnav/mobnav.component';
import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs';
import { UserService } from './services/user.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.css'],
  standalone: true,
  imports: [CommonModule, IonicModule, MobnavComponent],
})
export class AppComponent implements OnInit, OnDestroy {
  isAuth: boolean = false;
  authSub?: Subscription;

  constructor(private userService: UserService) {}

  ngOnInit(): void {
    this.authSub = this.userService.isAuth$.subscribe((authState) => {
      this.isAuth = authState;
    });
  }

  ngOnDestroy(): void {
    if (this.authSub) {
      this.authSub.unsubscribe();
    }
  }
}
