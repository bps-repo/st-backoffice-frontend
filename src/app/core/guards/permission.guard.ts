import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable, of } from 'rxjs';
import { catchError, map, switchMap, take } from 'rxjs/operators';
import { UserManagementService } from '../services/user-management.service';
import { authFeature } from '../store/auth/reducers/auth.reducers';

@Injectable({
  providedIn: 'root',
})
export class PermissionGuard implements CanActivate {
  constructor(
    private store: Store,
    private router: Router,
    private userManagementService: UserManagementService
  ) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> {
    const requiredPermission = route.data['permission'];

    if (!requiredPermission) {
      return of(true); // No permission required for this route
    }

    return this.store.select(authFeature.selectToken).pipe(
      take(1),
      switchMap((token) => {
        if (!token) {
          this.router.navigate(['/login']);
          return of(false);
        }

        // Get user ID from token (implementation depends on how you store user info)
        const userId = this.getUserIdFromToken(token);

        return this.userManagementService.getUserPermissions(userId).pipe(
          map((permissions) => {
            const hasPermission = permissions.some(p => p.name === requiredPermission);

            if (!hasPermission) {
              this.router.navigate(['/unauthorized']);
            }

            return hasPermission;
          }),
          catchError(() => {
            this.router.navigate(['/login']);
            return of(false);
          })
        );
      })
    );
  }

  private getUserIdFromToken(token: string): string {
    // This is a placeholder. Implement according to your token structure
    // You might need to decode the JWT token to get the user ID
    // For example: return jwt_decode(token).sub;
    return 'user-id'; // Replace with actual implementation
  }
}
