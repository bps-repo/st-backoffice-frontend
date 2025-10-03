import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Role } from '../models/auth/role';
import { ApiResponse, PageableResponse } from "../models/ApiResponseService";
import { filter, map } from "rxjs/operators";
import { Store } from '@ngrx/store';
import * as RolesActions from '../store/roles/roles.actions';
import * as RolesSelectors from '../store/roles/roles.selectors';
import { AppState } from '../store';

interface CreateRoleWithPermissionsRequest {
    name: string;
    description: string;
    permissionIds: string[];
}

@Injectable({
    providedIn: 'root',
})
export class RoleService {
    public apiUrl = `${environment.apiUrl}/roles`;

    constructor(
        public http: HttpClient,
        private store: Store<AppState>
    ) {
    }

    // Original HTTP method for effects to use
    getAllRoles(): Observable<Role[]> {
        return this.http.get<ApiResponse<PageableResponse<Role[]>>>(this.apiUrl).pipe(
            map(response => {
                const roles = response.data.content as Role[];
                // Ensure permissions array is initialized for each role
                return roles.map(role => {
                    if (!role.permissions) {
                        role.permissions = [];
                    }
                    return role;
                }).filter(r => r.name != "STUDENT");
            }),
        );
    }

    getRoleById(id: string): Observable<Role> {
        return this.http.get<ApiResponse<Role>>(`${this.apiUrl}/${id}`).pipe(
            map(response => {
                const role = response.data as Role;
                // Ensure permissions array is initialized even if it's missing in the API response
                if (!role.permissions) {
                    role.permissions = [];
                }
                return role;
            }),
        );
    }

    // Original HTTP method for effects to use
    createRole(role: Role): Observable<Role> {
        return this.http.post<ApiResponse<Role>>(this.apiUrl, role).pipe(
            map(response => {
                const createdRole = response.data as Role;
                if (!createdRole.permissions) {
                    createdRole.permissions = [];
                }
                return createdRole;
            }),
        );
    }



    updateRole(role: Role): Observable<Role> {
        return this.http.patch<ApiResponse<Role>>(`${this.apiUrl}/${role.id}`, role).pipe(
            map(response => {
                const updatedRole = response.data as Role;
                if (!updatedRole.permissions) {
                    updatedRole.permissions = [];
                }
                return updatedRole;
            }),
        );
    }

    deleteRole(id: string): Observable<void> {
        // Dispatch the deleteRole action
        this.store.dispatch(RolesActions.deleteRole({ id }));
        // Return the original HTTP observable for compatibility
        return this.http.delete<void>(`${this.apiUrl}/${id}`);
    }

    addPermissionToRole(roleId: string, permissionId: string): Observable<Role> {
        // Dispatch the addPermissionToRole action
        this.store.dispatch(RolesActions.addPermissionToRole({ roleId, permissionId }));
        // Return the role from the store, filtering out undefined values
        return this.store.select(RolesSelectors.selectRoleById(roleId)).pipe(
            filter((role): role is Role => !!role)
        );
    }

    // Original HTTP method for effects to use
    postPermissionToRole(roleId: string, permissionId: string): Observable<Role> {
        return this.http.post<ApiResponse<Role>>(`${this.apiUrl}/${roleId}/permissions/${permissionId}`, {}).pipe(
            map(response => {
                const role = response.data as Role;
                if (!role.permissions) {
                    role.permissions = [];
                }
                return role;
            }),
        );
    }


    removePermissionFromRole(roleId: string, permissionId: string): Observable<Role> {
        return this.http.delete<ApiResponse<Role>>(`${this.apiUrl}/${roleId}/permissions/${permissionId}`).pipe(
            map(response => {
                const role = response.data as Role;
                if (!role.permissions) {
                    role.permissions = [];
                }
                return role;
            }),
        );
    }

    // Original HTTP method for effects to use
    addPermissionsBulkToRole(roleId: string, permissionIds: string[]): Observable<Role> {
        console.log("permissiont To ADD", permissionIds);

        return this.http.post<ApiResponse<Role>>(`${this.apiUrl}/permissions/add-bulk/${roleId}`, permissionIds).pipe(
            map(response => {
                const role = response.data as Role;
                if (!role.permissions) {
                    role.permissions = [];
                }
                return role;
            }),
        );
    }

    /**
     * Creates a role with permissions in a single request.
     * @param name The name of the role.
     * @param description The description of the role.
     * @param permissionIds Array of permission IDs to assign to the role.
     * @returns An observable containing the created Role object.
     */
    createRoleWithPermissions(name: string, description: string, permissionIds: string[]): Observable<Role> {
        // Dispatch the createRoleWithPermissions action
        this.store.dispatch(RolesActions.createRoleWithPermissions({ name, description, permissionIds }));
        // Return the selected role from the store, filtering out null/undefined values
        return this.store.select(RolesSelectors.selectSelectedRole).pipe(
            filter((selectedRole): selectedRole is Role => !!selectedRole)
        );
    }

    // Original HTTP method for effects to use
    postRoleWithPermissions(name: string, description: string, permissionIds: string[]): Observable<Role> {
        const request: CreateRoleWithPermissionsRequest = {
            name,
            description,
            permissionIds
        };
        return this.http.post<ApiResponse<Role>>(`${this.apiUrl}`, request).pipe(
            map(response => {
                const role = response.data as Role;
                if (!role.permissions) {
                    role.permissions = [];
                }
                return role;
            }),
        );
    }
}
