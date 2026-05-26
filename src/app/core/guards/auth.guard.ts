import {inject} from '@angular/core';
import {CanActivateFn, Router} from '@angular/router';
import {Store} from '@ngrx/store';
import {map, take} from 'rxjs';
import {authFeature} from '../store/auth/auth.reducers';
import {JwtTokenService} from '../services/jwtToken.service';

export const AuthGuard: CanActivateFn = () => {
    const store = inject(Store);
    const router = inject(Router);

    return store.select(authFeature.selectIsAuthenticated).pipe(
        take(1),
        map((isAuthenticated) => {
            const storedToken = localStorage.getItem('accessToken');
            let tokenValid = false;

            if (storedToken) {
                try {
                    JwtTokenService.decodeToken(storedToken);
                    tokenValid = !JwtTokenService.isTokenExpired();
                } catch {
                    tokenValid = false;
                }
            }

            const actuallyAuthenticated = isAuthenticated && tokenValid;

            if (!actuallyAuthenticated) {
                if (storedToken && !tokenValid) {
                    localStorage.removeItem('accessToken');
                    localStorage.removeItem('refreshToken');
                }
                return router.createUrlTree(['/auth/login']);
            }

            return true;
        }),
    );
};
