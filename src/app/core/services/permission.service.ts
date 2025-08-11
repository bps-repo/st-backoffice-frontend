import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {environment} from 'src/environments/environment';
import {Permission} from '../models/auth/permission';
import {ApiResponse, PageableResponse} from "./interfaces/ApiResponseService";
import {map} from "rxjs/operators";

@Injectable({
    providedIn: 'root',
})
export class PermissionService {
    private apiUrl = `${environment.apiUrl}/permissions`;

    constructor(private http: HttpClient) {
    }

    getPermissions(): Observable<Permission[]> {
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
        const rootPermissions = permissionsCopy.filter(permission => !childrenIds.has(permission.id));

        return rootPermissions;
    }

    getPermission(id: number): Observable<Permission> {
        return this.http.get<Permission>(`${this.apiUrl}/${id}`);
    }

    createPermission(permission: Permission): Observable<Permission> {
        return this.http.post<Permission>(this.apiUrl, permission);
    }

    updatePermission(permission: Permission): Observable<Permission> {
        return this.http.put<Permission>(`${this.apiUrl}/${permission.id}`, permission);
    }

    deletePermission(id: number): Observable<void> {
        return this.http.delete<void>(`${this.apiUrl}/${id}`);
    }
}
