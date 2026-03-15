import { inject } from '@angular/core';
import { Router, CanActivateFn } from '@angular/router';
import { AuthGateway } from '../gateways/auth.gateway';

export const authGuard: CanActivateFn = () => {
  const authGateway = inject(AuthGateway);
  const router = inject(Router);

  if (authGateway.checkAuth()) {
    return true;
  }

  return router.parseUrl('/login');
};
