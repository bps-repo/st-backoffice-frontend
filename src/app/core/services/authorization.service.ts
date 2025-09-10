import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable, of, BehaviorSubject, combineLatest } from 'rxjs';
import { map, switchMap, take, tap, catchError, shareReplay } from 'rxjs/operators';
import { UserManagementService } from './user-management.service';
import { Permission } from '../models/auth/permission';
import { authFeature } from '../store/auth/auth.reducers';
import { AppState } from '../store';
import { User } from '../models/auth/user';

/**
 * Generic service for handling user authorization based on permissions.
 * Provides methods to check user access rights and manage permission caching.
 */
@Injectable({
  providedIn: 'root'
})
export class AuthorizationService {
  private permissionCache = new Map<string, Permission[]>();
  private currentUserPermissions$ = new BehaviorSubject<Permission[]>([]);
  private cacheExpiry = new Map<string, number>();
  private readonly CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

  constructor(
    private store: Store<AppState>,
    private userManagementService: UserManagementService
  ) {
    this.initializeUserPermissions();
  }

  /**
   * Initialize user permissions from the store
   */
  private initializeUserPermissions(): void {
    const stored = localStorage.getItem('currentUser');
    if (stored) {
      const user = JSON.parse(stored) as User;
      console.log('user', user.allPermissions);
      this.currentUserPermissions$.next(user.allPermissions || []);
    }
    this.store.select(authFeature.selectUser).pipe(
      switchMap(user => {
        if (user?.id) {
          return this.getUserPermissions();
        }
        return of([]);
      }),
      take(1)
    ).subscribe(permissions => {
      this.currentUserPermissions$.next(permissions);
    });
  }

  /**
   * Get user permissions with caching
   * @param userId - The user ID
   * @param forceRefresh - Force refresh the cache
   * @returns Observable of user permissions
   */
  getUserPermissions(forceRefresh: boolean = false): Observable<Permission[]> {
    const cacheKey = `user_me`;
    const now = Date.now();
    const cachedPermissions = this.permissionCache.get(cacheKey);
    const cacheTime = this.cacheExpiry.get(cacheKey);

    // Return cached permissions if valid and not forcing refresh
    if (!forceRefresh && cachedPermissions && cacheTime && (now - cacheTime) < this.CACHE_DURATION) {
      return of(cachedPermissions);
    }

    // Fetch fresh permissions
    return this.userManagementService.getUserPermissions().pipe(
      tap(permissions => {
        this.permissionCache.set(cacheKey, permissions);
        this.cacheExpiry.set(cacheKey, now);
        this.currentUserPermissions$.next(permissions);
      }),
      catchError(error => {
        console.error('Error fetching user permissions:', error);
        return of([]);
      }),
      shareReplay(1)
    );
  }

  /**
   * Check if user has a specific permission
   * @param permissionName - The permission name to check
   * @param userId - Optional user ID, uses current user if not provided
   * @returns Observable<boolean>
   */
  hasPermission(permissionName: string, userId?: string): Observable<boolean> {
    console.log('permissionName', permissionName);
    if (!permissionName) {
      return of(false);
    }

    if (userId) {
      return this.getUserPermissions().pipe(
        map(permissions => this.checkPermissionInList(permissions, permissionName))
      );
    }

    return this.currentUserPermissions$.pipe(
      map(permissions => this.checkPermissionInList(permissions, permissionName))
    );
  }

  /**
   * Check if user has any of the specified permissions
   * @param permissionNames - Array of permission names to check
   * @param userId - Optional user ID, uses current user if not provided
   * @returns Observable<boolean>
   */
  hasAnyPermission(permissionNames: string[], userId?: string): Observable<boolean> {
    if (!permissionNames || permissionNames.length === 0) {
      return of(false);
    }

    if (userId) {
      return this.getUserPermissions().pipe(
        map(permissions =>
          permissionNames.some(permissionName =>
            this.checkPermissionInList(permissions, permissionName)
          )
        )
      );
    }

    return this.currentUserPermissions$.pipe(
      map(permissions =>
        permissionNames.some(permissionName =>
          this.checkPermissionInList(permissions, permissionName)
        )
      )
    );
  }

  /**
   * Check if user has all of the specified permissions
   * @param permissionNames - Array of permission names to check
   * @param userId - Optional user ID, uses current user if not provided
   * @returns Observable<boolean>
   */
  hasAllPermissions(permissionNames: string[], userId?: string): Observable<boolean> {
    if (!permissionNames || permissionNames.length === 0) {
      return of(true);
    }

    if (userId) {
      return this.getUserPermissions().pipe(
        map(permissions =>
          permissionNames.every(permissionName =>
            this.checkPermissionInList(permissions, permissionName)
          )
        )
      );
    }

    return this.currentUserPermissions$.pipe(
      map(permissions =>
        permissionNames.every(permissionName =>
          this.checkPermissionInList(permissions, permissionName)
        )
      )
    );
  }

  /**
   * Check if user has permission for a specific module
   * @param moduleName - The module name to check
   * @param action - Optional action (view, create, update, delete, manage)
   * @param userId - Optional user ID, uses current user if not provided
   * @returns Observable<boolean>
   */
  hasModulePermission(moduleName: string, action: string = 'view', userId?: string): Observable<boolean> {
    const permissionName = `${moduleName}.${action}`;
    return this.hasPermission(permissionName, userId);
  }

  /**
   * Check if user has management permission for a module (includes all sub-permissions)
   * @param moduleName - The module name to check
   * @param userId - Optional user ID, uses current user if not provided
   * @returns Observable<boolean>
   */
  hasModuleManagePermission(moduleName: string, userId?: string): Observable<boolean> {
    return this.hasPermission(`${moduleName}.manage`, userId);
  }

  /**
   * Get all permissions for the current user
   * @returns Observable<Permission[]>
   */
  getCurrentUserPermissions(): Observable<Permission[]> {
    return this.currentUserPermissions$.asObservable();
  }

  /**
   * Get permission names for the current user
   * @returns Observable<string[]>
   */
  getCurrentUserPermissionNames(): Observable<string[]> {
    return this.currentUserPermissions$.pipe(
      map(permissions => permissions.map(p => p.name))
    );
  }

  /**
   * Check if user has permission by ID
   * @param permissionId - The permission ID to check
   * @param userId - Optional user ID, uses current user if not provided
   * @returns Observable<boolean>
   */
  hasPermissionById(permissionId: string, userId?: string): Observable<boolean> {
    if (!permissionId) {
      return of(false);
    }

    if (userId) {
      return this.getUserPermissions().pipe(
        map(permissions => permissions.some(p => p.id === permissionId))
      );
    }

    return this.currentUserPermissions$.pipe(
      map(permissions => permissions.some(p => p.id === permissionId))
    );
  }

  /**
   * Check if user has any permission in a specific module
   * @param moduleName - The module name to check
   * @param userId - Optional user ID, uses current user if not provided
   * @returns Observable<boolean>
   */
  hasAnyModulePermission(moduleName: string, userId?: string): Observable<boolean> {
    if (userId) {
      return this.getUserPermissions().pipe(
        map(permissions =>
          permissions.some(p => p.name.startsWith(`${moduleName}.`))
        )
      );
    }

    return this.currentUserPermissions$.pipe(
      map(permissions =>
        permissions.some(p => p.name.startsWith(`${moduleName}.`))
      )
    );
  }

  /**
   * Get user's permissions for a specific module
   * @param moduleName - The module name
   * @param userId - Optional user ID, uses current user if not provided
   * @returns Observable<Permission[]>
   */
  getModulePermissions(moduleName: string, userId?: string): Observable<Permission[]> {
    if (userId) {
      return this.getUserPermissions().pipe(
        map(permissions =>
          permissions.filter(p => p.name.startsWith(`${moduleName}.`))
        )
      );
    }

    return this.currentUserPermissions$.pipe(
      map(permissions =>
        permissions.filter(p => p.name.startsWith(`${moduleName}.`))
      )
    );
  }

  /**
   * Clear permission cache for a specific user or all users
   * @param userId - Optional user ID, clears all cache if not provided
   */
  clearPermissionCache(userId?: string): void {
    if (userId) {
      const cacheKey = `user_${userId}`;
      this.permissionCache.delete(cacheKey);
      this.cacheExpiry.delete(cacheKey);
    } else {
      this.permissionCache.clear();
      this.cacheExpiry.clear();
    }
  }

  /**
   * Refresh permissions for the current user
   * @returns Observable<Permission[]>
   */
  refreshCurrentUserPermissions(): Observable<Permission[]> {
    return this.store.select(authFeature.selectUser).pipe(
      switchMap(user => {
        if (user?.id) {
          return this.getUserPermissions(true);
        }
        return of([]);
      }),
      tap(permissions => {
        this.currentUserPermissions$.next(permissions);
      })
    );
  }

  /**
   * Check if permission exists in the permission list (including hierarchical checking)
   * @param permissions - Array of permissions to check
   * @param permissionName - The permission name to find
   * @returns boolean
   */
  private checkPermissionInList(permissions: Permission[], permissionName: string): boolean {
    if (!permissions || permissions.length === 0) {
      return false;
    }

    // Direct permission check
    const hasDirectPermission = permissions.some(p => p.name === permissionName);
    if (hasDirectPermission) {
      return true;
    }

    // Hierarchical permission check
    return this.checkHierarchicalPermission(permissions, permissionName);
  }

  /**
   * Check for hierarchical permissions (e.g., if user has 'students.manage', they have all student permissions)
   * @param permissions - Array of permissions to check
   * @param permissionName - The permission name to find
   * @returns boolean
   */
  private checkHierarchicalPermission(permissions: Permission[], permissionName: string): boolean {
    const permissionParts = permissionName.split('.');

    // Check for parent permissions (e.g., 'students.manage' grants access to 'students.view')
    for (let i = permissionParts.length - 1; i > 0; i--) {
      const parentPermission = permissionParts.slice(0, i).join('.') + '.manage';
      if (permissions.some(p => p.name === parentPermission)) {
        return true;
      }
    }

    // Check for wildcard permissions (e.g., 'dashboard.*' grants access to all dashboard permissions)
    const wildcardPermission = permissionParts.slice(0, -1).join('.') + '.*';
    if (permissions.some(p => p.name === wildcardPermission)) {
      return true;
    }

    return false;
  }

  /**
   * Get permission details by name
   * @param permissionName - The permission name
   * @param userId - Optional user ID, uses current user if not provided
   * @returns Observable<Permission | null>
   */
  getPermissionByName(permissionName: string, userId?: string): Observable<Permission | null> {
    if (userId) {
      return this.getUserPermissions().pipe(
        map(permissions => permissions.find(p => p.name === permissionName) || null)
      );
    }

    return this.currentUserPermissions$.pipe(
      map(permissions => permissions.find(p => p.name === permissionName) || null)
    );
  }

  /**
   * Check if user is authenticated and has permissions
   * @returns Observable<boolean>
   */
  isAuthenticatedWithPermissions(): Observable<boolean> {
    return combineLatest([
      this.store.select(authFeature.selectIsAuthenticated),
      this.currentUserPermissions$
    ]).pipe(
      map(([isAuthenticated, permissions]) =>
        isAuthenticated && permissions.length > 0
      )
    );
  }
}
