import { Routes } from '@angular/router';
import { authGuard } from './guards/auth.guard';

export const routes: Routes = [
  {
    path: 'login',
    loadComponent: () =>
      import('./pages/login/login.page').then((m) => m.LoginPage),
  },
  {
    path: 'registro',
    loadComponent: () =>
      import('./pages/registro/registro.page').then((m) => m.RegistroPage),
  },

  {
    path: 'user',
    loadComponent: () =>
      import('./pages/usuario/usuario.page').then((m) => m.UsuarioPage),
    canActivate: [authGuard],
  },
  {
    path: 'mapview',
    loadComponent: () =>
      import('./pages/mapview/mapview.page').then((m) => m.MapviewPage),
    canActivate: [authGuard],
  },
  {
    path: 'trip',
    loadComponent: () =>
      import('./pages/trip/trip.page').then((m) => m.TripPage),
    canActivate: [authGuard],
  },
  {
    path: 'perfil',
    loadComponent: () =>
      import('./pages/perfil/perfil.page').then((m) => m.PerfilPage),
    canActivate: [authGuard],
  },
  {
    path: 'config',
    loadComponent: () =>
      import('./pages/config/config.page').then((m) => m.ConfigPage),
    canActivate: [authGuard],
  },
  { path: '**', redirectTo: 'perfil', pathMatch: 'full' },
];
