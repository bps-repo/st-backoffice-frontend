import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable, of } from 'rxjs';
import { catchError, map, switchMap, take } from 'rxjs/operators';
import { AuthorizationService } from '../services/authorization.service';
import { authFeature } from '../store/auth/auth.reducers';
import { MessageService } from 'primeng/api';

/**
 * Guard for checking user permissions.
 * Allows access if the user has the required permission or permissions.
 */
@Injectable({
    providedIn: 'root',
})
export class PermissionGuard implements CanActivate {
    constructor(
        private store: Store,
        private router: Router,
        private authorizationService: AuthorizationService,
        private messageService: MessageService
    ) {
        console.log('PermissionGuard constructor');
    }

    canActivate(
        route: ActivatedRouteSnapshot,
        state: RouterStateSnapshot,
    ): Observable<boolean> {
        const requiredPermission = route.data['permission'];
        const requiredPermissions = route.data['permissions']; // Support for multiple permissions
        const requireAll = route.data['requireAll'] || false; // Whether to require all permissions

        // If no permission is required, allow access
        if (!requiredPermission && !requiredPermissions) {
            return of(true);
        }

        return this.store.select(authFeature.selectIsAuthenticated).pipe(
            take(1),
            switchMap((isAuthenticated) => {
                if (!isAuthenticated) {
                    this.router.navigate(['/auth/login']);
                    return of(false);
                }

                // Check single permission
                if (requiredPermission) {
                    return this.authorizationService.hasPermission(requiredPermission).pipe(
                        map((hasPermission) => {
                            if (!hasPermission) {
                                this.messageService.add({
                                    severity: 'error',
                                    summary: 'Acesso negado',
                                    detail: 'Você não tem permissão para acessar este recurso.',
                                    life: 5000
                                });
                                //this.router.navigate(['/unauthorized']);
                            }
                            return hasPermission;
                        }),
                        catchError(() => {
                            this.messageService.add({
                                severity: 'error',
                                summary: 'Acesso negado',
                                detail: 'Você não tem permissão para acessar este recurso.',
                                life: 5000
                            });
                            this.router.navigate(['/auth/login']);
                            return of(false);
                        })
                    );
                }

                // Check multiple permissions
                if (requiredPermissions && Array.isArray(requiredPermissions)) {
                    const permissionCheck$ = requireAll
                        ? this.authorizationService.hasAllPermissions(requiredPermissions)
                        : this.authorizationService.hasAnyPermission(requiredPermissions);

                    return permissionCheck$.pipe(
                        map((hasPermission) => {
                            if (!hasPermission) {
                                this.messageService.add({
                                    severity: 'error',
                                    summary: 'Acesso negado',
                                    detail: 'Você não tem permissão para acessar este recurso.',
                                    life: 5000
                                });
                                //this.router.navigate(['/unauthorized']);
                            }
                            return hasPermission;
                        }),
                        catchError(() => {
                            this.messageService.add({
                                severity: 'error',
                                summary: 'Acesso negado',
                                detail: 'Você não tem permissão para acessar este recurso.',
                                life: 5000
                            });
                            this.router.navigate(['/auth/login']);
                            return of(false);
                        })
                    );
                }

                return of(false);
            })
        );
    }
}
