import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { UserService } from '../services/user.service';
import { firstValueFrom } from 'rxjs';

export const authGuard: CanActivateFn = async (route, state) => {
  const authService = inject(UserService);
  const router = inject(Router);

  const isAuth = await firstValueFrom(authService.isAuth$);

  if (isAuth) {
    return true;
  } else {
    // No logueado
    //router.navigate(['/login']);
    return true;
  }
};
