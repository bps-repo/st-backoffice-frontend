import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {environment} from 'src/environments/environment';
import {Permission} from '../models/auth/permission';
import {ApiResponse} from "./interfaces/ApiResponseService";
import {filter, map} from "rxjs/operators";
import {Store} from '@ngrx/store';
import * as PermissionsActions from '../store/permissions/actions/permissions.actions';
import * as PermissionsSelectors from '../store/permissions/selectors/permissions.selectors';
import {AppState} from '../store';

@Injectable({
    providedIn: 'root',
})
export class PermissionService {
    public apiUrl = `${environment.apiUrl}/permissions`;

    constructor(
        public http: HttpClient,
        private store: Store<AppState>
    ) {
    }

    getPermissions(): Observable<Permission[]> {
        // Dispatch the loadPermissionTree action
        this.store.dispatch(PermissionsActions.loadPermissionTree());
        // Return the permission tree from the store
        return this.store.select(PermissionsSelectors.selectPermissionTree);
    }

    // Original HTTP method for effects to use
    fetchPermissionTree(): Observable<Permission[]> {
        return this.http.get<ApiResponse<Permission[]>>(`${this.apiUrl}/tree`).pipe(
            map(response => {
                const permissions = response.data as Permission[];
                return this.buildPermissionTree(permissions);
            }),
        );
    }

    /**
     * Builds a hierarchical tree structure from flat permissions array
     * @param permissions The flat array of permissions from the API
     * @returns An array of root permissions with properly populated children
     */
    private buildPermissionTree(permissions: Permission[]): Permission[] {
        if (!permissions || permissions.length === 0) {
            return [];
        }

        // Create a map of all permissions by ID for quick lookup
        const permissionsMap = new Map<string, Permission>();

        // Create a deep copy of permissions to avoid modifying the original data
        const permissionsCopy = permissions.map(p => ({...p, children: p.children || []}));

        // Populate the map with permissions
        permissionsCopy.forEach(permission => {
            permissionsMap.set(permission.id, permission);
        });

        // Create a set to track which permissions are children
        const childrenIds = new Set<string>();

        // Build parent-child relationships
        permissionsCopy.forEach(permission => {
            if (permission.children && permission.children.length > 0) {
                // For each child reference in the children array
                permission.children.forEach(childRef => {
                    // Get the full child object from the map
                    const childPermission = permissionsMap.get(childRef.id);

                    if (childPermission) {
                        // Mark this permission as a child
                        childrenIds.add(childPermission.id);

                        // Replace the reference with the full child object
                        // This ensures we maintain the full hierarchical structure
                        const childIndex = permission.children!.findIndex(c => c.id === childRef.id);
                        if (childIndex !== -1) {
                            permission.children![childIndex] = childPermission;
                        }
                    }
                });
            }
        });

        // Root permissions are those that aren't children of any other permission
        return permissionsCopy.filter(permission => !childrenIds.has(permission.id));
    }

    getPermission(id: number): Observable<Permission> {
        // Dispatch the loadPermission action
        this.store.dispatch(PermissionsActions.loadPermission({ id: id.toString() }));
        // Return the permission from the store, filtering out undefined values
        return this.store.select(PermissionsSelectors.selectPermissionById(id.toString())).pipe(
            filter((permission): permission is Permission => !!permission)
        );
    }

    // Original HTTP method for effects to use
    fetchPermission(id: number): Observable<Permission> {
        return this.http.get<ApiResponse<Permission>>(`${this.apiUrl}/${id}`).pipe(
            map(response => response.data as Permission)
        );
    }

    updatePermission(permission: Permission): Observable<Permission> {
        // Dispatch the updatePermission action
        this.store.dispatch(PermissionsActions.updatePermission({ permission }));
        // Return the permission from the store, filtering out undefined values
        return this.store.select(PermissionsSelectors.selectPermissionById(permission.id)).pipe(
            filter((updatedPermission): updatedPermission is Permission => !!updatedPermission)
        );
    }

    // Original HTTP method for effects to use
    putPermission(permission: Permission): Observable<Permission> {
        return this.http.put<ApiResponse<Permission>>(`${this.apiUrl}/${permission.id}`, permission).pipe(
            map(response => response.data as Permission)
        );
    }

    deletePermission(id: number): Observable<void> {
        // Dispatch the deletePermission action
        this.store.dispatch(PermissionsActions.deletePermission({ id: id.toString() }));
        // Return the original HTTP observable for compatibility
        return this.http.delete<void>(`${this.apiUrl}/${id}`);
    }
}
