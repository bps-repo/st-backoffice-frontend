import {Injectable} from '@angular/core';
import {
    CanActivate,
    Router,
} from '@angular/router';
import {Store} from '@ngrx/store';
import {authFeature} from '../store/auth/auth.reducers';
import {map, Observable, take} from 'rxjs';
import { JwtTokenService } from '../services/jwtToken.service';

/**
 * Guard for checking if the user is authenticated.
 * Allows access if the user is authenticated.
 */
@Injectable({
    providedIn: 'root',
})
export class AuthGuard implements CanActivate {

    constructor(private store: Store, private router: Router) {
    }

    canActivate(): Observable<boolean> {
        return this.store.select(authFeature.selectIsAuthenticated).pipe(
            take(1),
            map((isAuthenticated) => {
                // Double-check with localStorage and token validity
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
                    // Clear invalid tokens
                    if (storedToken && !tokenValid) {
                        localStorage.removeItem('accessToken');
                        localStorage.removeItem('refreshToken');
                    }
                    this.router.navigate(['/auth/login']);
                }

                return actuallyAuthenticated;
            })
        );
    }
}
