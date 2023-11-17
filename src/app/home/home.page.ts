import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { Router, RouterLink } from '@angular/router';
import { UserService } from 'src/app/services/user.service';
import { Observable } from 'rxjs';
import { HttpClientModule } from '@angular/common/http';
import { UserModel } from '../models/UserModel';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, RouterLink, FormsModule, HttpClientModule],
  providers: [UserService]
})
export class HomePage implements OnInit {


  user: UserModel;
  


  constructor(private router: Router,private _userService: UserService) { 
    this.user = this.router.getCurrentNavigation()?.extras.state?.['userInfo'];
    console.log("user id:", this.user.id)
    console.log("state:", this.router.getCurrentNavigation()?.extras.state)
  }

  ngOnInit() {
    console.log(this.user.id);
  }

  sendPage(){
    this._userService.getUserType(this.user.id).subscribe(type =>{
      console.log("usertype:", type[0].type);
      if (type[0].type == 1){
        this.router.navigate(['/admin'], { state: {userInfo: this.user}})
      } else {
        this.router.navigate(['/usuario'], {state: {userInfo: this.user}})
      }
    })
  }
  cerrarSesion(){
    this.router.navigate(['/login'])

  }


}
