import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {environment} from 'src/environments/environment';
import {Role} from '../models/auth/role';
import {Permission} from '../models/auth/permission';
import {ApiResponse, PageableResponse} from "./interfaces/ApiResponseService";
import {filter, map} from "rxjs/operators";
import {Employee} from "../models/corporate/employee";
import {Store} from '@ngrx/store';
import * as RolesActions from '../store/roles/actions/roles.actions';
import * as RolesSelectors from '../store/roles/selectors/roles.selectors';
import {AppState} from '../store';

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

    getRoles(): Observable<Role[]> {
        // Dispatch the loadRoles action
        this.store.dispatch(RolesActions.loadRoles());
        // Return the roles from the store
        return this.store.select(RolesSelectors.selectAllRoles);
    }

    // Original HTTP method for effects to use
    fetchRoles(): Observable<Role[]> {
        return this.http.get<ApiResponse<PageableResponse<Role[]>>>(this.apiUrl).pipe(
            map(response => {
                const roles = response.data.content as Role[];
                // Ensure permissions array is initialized for each role
                return roles.map(role => {
                    if (!role.permissions) {
                        role.permissions = [];
                    }
                    return role;
                });
            }),
        );
    }

    getRole(id: string): Observable<Role> {
        // Dispatch the loadRole action
        this.store.dispatch(RolesActions.loadRole({id}));
        // Return the role from the store, filtering out undefined values
        return this.store.select(RolesSelectors.selectRoleById(id)).pipe(
            filter((role): role is Role => !!role)
        );
    }

    // Original HTTP method for effects to use
    fetchRole(id: string): Observable<Role> {
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

    createRole(role: Role): Observable<Role> {
        // Dispatch the createRole action
        this.store.dispatch(RolesActions.createRole({role}));
        // Return the selected role from the store, filtering out null/undefined values
        return this.store.select(RolesSelectors.selectSelectedRole).pipe(
            filter((selectedRole): selectedRole is Role => !!selectedRole)
        );
    }

    // Original HTTP method for effects to use
    postRole(role: Role): Observable<Role> {
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
        // Dispatch the updateRole action
        this.store.dispatch(RolesActions.updateRole({role}));
        // Return the selected role from the store, filtering out undefined values
        return this.store.select(RolesSelectors.selectRoleById(role.id)).pipe(
            filter((updatedRole): updatedRole is Role => !!updatedRole)
        );
    }

    // Original HTTP method for effects to use
    putRole(role: Role): Observable<Role> {
        return this.http.put<ApiResponse<Role>>(`${this.apiUrl}/${role.id}`, role).pipe(
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
        this.store.dispatch(RolesActions.deleteRole({id}));
        // Return the original HTTP observable for compatibility
        return this.http.delete<void>(`${this.apiUrl}/${id}`);
    }

    addPermissionToRole(roleId: string, permissionId: string): Observable<Role> {
        // Dispatch the addPermissionToRole action
        this.store.dispatch(RolesActions.addPermissionToRole({roleId, permissionId}));
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
        // Dispatch the removePermissionFromRole action
        this.store.dispatch(RolesActions.removePermissionFromRole({roleId, permissionId}));
        // Return the role from the store, filtering out undefined values
        return this.store.select(RolesSelectors.selectRoleById(roleId)).pipe(
            filter((role): role is Role => !!role)
        );
    }

    // Original HTTP method for effects to use
    deletePermissionFromRole(roleId: string, permissionId: string): Observable<Role> {
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

    /**
     * Adds multiple permissions to a role in bulk.
     * @param roleId The ID of the role.
     * @param permissionIds Array of permission IDs to add to the role.
     * @returns An observable containing the updated Role object.
     */
    addPermissionsBulkToRole(roleId: string, permissionIds: string[]): Observable<Role> {
        // Dispatch the addPermissionsBulkToRole action
        this.store.dispatch(RolesActions.addPermissionsBulkToRole({roleId, permissionIds}));
        // Return the role from the store, filtering out undefined values
        return this.store.select(RolesSelectors.selectRoleById(roleId)).pipe(
            filter((role): role is Role => !!role)
        );
    }

    // Original HTTP method for effects to use
    postPermissionsBulkToRole(roleId: string, permissionIds: string[]): Observable<Role> {
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
        this.store.dispatch(RolesActions.createRoleWithPermissions({name, description, permissionIds}));
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
