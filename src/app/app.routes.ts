import { Routes } from '@angular/router';

export const routes: Routes = [

  { path: 'login', loadComponent: () => import('./pages/login/login.page').then(m => m.LoginPage) },
  { path: 'registro', loadComponent: () => import('./pages/registro/registro.page').then(m => m.RegistroPage) },
  { path: 'home', loadComponent: () => import('./pages/home/home.page').then(m => m.HomePage) },
  { path: 'user', loadComponent: () => import('./pages/usuario/usuario.page').then(m => m.UsuarioPage) },
  { path: 'mapview', loadComponent: () => import('./pages/mapview/mapview.page').then(m => m.MapviewPage) },
  { path: 'trip', loadComponent: () => import('./pages/trip/trip.page').then(m => m.TripPage) },
  { path: '**', redirectTo: 'mapview', pathMatch: "full" }

];
