import {Injectable, inject} from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot} from '@angular/router';
import {Store} from '@ngrx/store';
import {Observable, of} from 'rxjs';
import {catchError, map, switchMap, take} from 'rxjs/operators';
import {UserManagementService} from '../services/user-management.service';
import {authFeature} from "../store/auth/auth.reducers";

@Injectable({
    providedIn: 'root',
})
export class RoleGuard implements CanActivate {
    private store = inject(Store);
    private router = inject(Router);
    private userManagementService = inject(UserManagementService);


    canActivate(
        route: ActivatedRouteSnapshot
    ): Observable<boolean> {
        const requiredRole = route.data['role'];

        if (!requiredRole) {
            return of(true); // No role required for this route
        }

        return this.store.select(authFeature.selectToken).pipe(
            take(1),
            switchMap((token) => {
                if (!token) {
                    this.router.navigate(['/login']).then();
                    return of(false);
                }

                // Get user ID from token (implementation depends on how you store user info)
                const userId = this.getUserIdFromToken(token);

                return this.userManagementService.getUserRoles(userId).pipe(
                    map((roles) => {
                        const hasRole = roles.some(r => r.name === requiredRole);

                        if (!hasRole) {
                            this.router.navigate(['/unauthorized']).then();
                        }

                        return hasRole;
                    }),
                    catchError(() => {
                        this.router.navigate(['/login']).then();
                        return of(false);
                    })
                );
            })
        );
    }

    private getUserIdFromToken(token: string): string {
        return 'user-id'; // Replace with actual implementation
    }
}
