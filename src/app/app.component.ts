import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { MobnavComponent } from './components/mobnav/mobnav.component';
import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs';
import { UserService } from './services/user.service';
import { GlobalService } from './services/global.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.css'],
  standalone: true,
  imports: [CommonModule, IonicModule, MobnavComponent],
})
export class AppComponent implements OnInit, OnDestroy {
  private _globalService = inject(GlobalService);

  isAuth: boolean = false;
  authSub?: Subscription;

  isLoading: boolean = false;

  constructor(private userService: UserService) {
    document.body.classList.toggle('dark', true);
  }

  ngOnInit(): void {
    this._globalService.loading$.subscribe((loading) => {
      this.isLoading = loading;
    });

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
