import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { authFeature } from '../store/reducers/auth.reducers';
import { map, Observable, take } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  constructor(private store: Store, private router: Router) {}

  canActivate(): Observable<boolean> {
    return this.store.select(authFeature.selectToken).pipe(
      take(1),
      map((token) => {
        const storedToken = localStorage.getItem('authToken');
        const isAuthenticated = !!token || !!storedToken;

        if (!isAuthenticated) {
          this.router.navigate(['/auth/login']);
        }

        return isAuthenticated;
      })
    );
  }
}
