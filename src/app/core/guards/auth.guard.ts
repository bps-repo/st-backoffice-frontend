import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { map, take } from 'rxjs';
import { authFeature } from '../store/reducers/auth.reducers';

export const authGuard = () => {
  const store = inject(Store);
  const router = inject(Router);

  return store.select(authFeature.selectToken).pipe(
    take(1),
    map((token) => {
      const storedToken = localStorage.getItem('authToken');
      const isAuthenticated = !!token || !!storedToken;

      if (!isAuthenticated) {
        router.navigate(['/auth/login']);
      }

      return isAuthenticated;
    })
  );
};
