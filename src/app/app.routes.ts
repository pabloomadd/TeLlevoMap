import { Routes } from '@angular/router';
import { RegistroPage } from './pages/registro/registro.page';
import { LoginPage } from './pages/login/login.page';
import { HomePage } from './pages/home/home.page';
import { UsuarioPage } from './pages/usuario/usuario.page';
import { AdminPage } from './pages/admin/admin.page';
import { MapsPage } from './pages/maps/maps.page';

export const routes: Routes = [
  { path: 'registro', component: RegistroPage },
  { path: 'login', component: LoginPage },
  { path: 'home', component: HomePage },
  { path: 'user', component: UsuarioPage },
  { path: 'admin', component: AdminPage },
  { path: 'maps', component: MapsPage },
  {path: '**', redirectTo: 'home', pathMatch: "full"}

];
