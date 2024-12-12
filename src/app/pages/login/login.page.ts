import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { Router, NavigationExtras, RouterLink } from '@angular/router';
import { IUserLogin } from '../../models/IUserLogin';
import { UserModel } from '../../models/UserModel';
import { UserService } from '../../services/user.service';
import { Preferences } from '@capacitor/preferences';
import { Subscription, Observable } from 'rxjs';
import { HttpClientModule } from '@angular/common/http';


@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, RouterLink, FormsModule, HttpClientModule],
  providers: [UserService]
})


  export class LoginPage implements OnInit, OnDestroy{

  userLoginModal: IUserLogin = {
    username: '',
    password: ''
  };


  public userExists?: UserModel;
  public userList$!: Subscription;
  public userList: UserModel[] = [];

  constructor(private route: Router, private _usuarioService: UserService) {

   }

  ngOnDestroy(): void {
    throw new Error('Method not implemented.');
  } 

  ngOnInit() {
    this.userLoginModalRestart();

  }

  async setObject(user: UserModel) {
    await Preferences.set({
      key: 'user',
      value: JSON.stringify(user)
    });
  }

  async userLogin(userLoginInfo: IUserLogin) {
    this._usuarioService.getLoginUser(userLoginInfo.username, userLoginInfo.password).subscribe(
      {
        next: (user: UserModel[]) => {
          console.log(user);
          if (user) {
            //EXISTE
            
            let userInfoSend: NavigationExtras = {
              state: {
                userInfo: user[0]
              }
            }
            console.log("Usuario existe...");
            this.setObject(user[0]);
            console.log("Info Enviada: ",userInfoSend);
            console.log("Info del Usuario: ",user);

            this.route.navigate(['/home'], userInfoSend)
          } else {
            //NO EXISTE
            console.log("Usuario no existe...");
          }
        },
        error: (err) => {

        },
        complete: () => {

        }
      }
    )
  }

  public userLoginModalRestart(): void{
    this.userLoginModal.username = '';
    this.userLoginModal.password = '';
  }


  goRegistro(){
    
    this.route.navigate (['/registro'])

  }



  
}
