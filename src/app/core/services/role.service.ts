import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {environment} from 'src/environments/environment';
import {Role} from '../models/auth/role';
import {Permission} from '../models/auth/permission';
import {ApiResponse, PageableResponse} from "./interfaces/ApiResponseService";
import {map} from "rxjs/operators";
import {Employee} from "../models/corporate/employee";

@Injectable({
    providedIn: 'root',
})
export class RoleService {
    private apiUrl = `${environment.apiUrl}/roles`;

    constructor(private http: HttpClient) {
    }

    getRoles(): Observable<Role[]> {
        return this.http.get<ApiResponse<PageableResponse<Role[]>>>(this.apiUrl).pipe(
            map(response => response.data.content as Role[]),
        );
    }

    getRole(id: string): Observable<Role> {
        return this.http.get<ApiResponse<Role>>(`${this.apiUrl}/${id}`).pipe(
            map(response => response.data as Role),
        );
    }

    createRole(role: Role): Observable<Role> {
        return this.http.post<ApiResponse<Role>>(this.apiUrl, role).pipe(
            map(response => response.data as Role),
        );
    }

    updateRole(role: Role): Observable<Role> {
        return this.http.put<ApiResponse<Role>>(`${this.apiUrl}/${role.id}`, role).pipe(
            map(response => response.data as Role),
        );
    }

    deleteRole(id: string): Observable<void> {
        return this.http.delete<void>(`${this.apiUrl}/${id}`);
    }

    addPermissionToRole(roleId: string, permissionId: string): Observable<Role> {
        return this.http.post<ApiResponse<Role>>(`${this.apiUrl}/${roleId}/permissions/${permissionId}`, {}).pipe(
            map(response => response.data as Role),
        );
    }

    removePermissionFromRole(roleId: string, permissionId: string): Observable<Role> {
        return this.http.delete<ApiResponse<Role>>(`${this.apiUrl}/${roleId}/permissions/${permissionId}`).pipe(
            map(response => response.data as Role),
        );
    }

    /**
     * Adds multiple permissions to a role in bulk.
     * @param roleId The ID of the role.
     * @param permissionIds Array of permission IDs to add to the role.
     * @returns An observable containing the updated Role object.
     */
    addPermissionsBulkToRole(roleId: string, permissionIds: string[]): Observable<Role> {
        return this.http.post<ApiResponse<Role>>(`${this.apiUrl}/permissions/add-bulk/${roleId}`, permissionIds).pipe(
            map(response => response.data as Role),
        );
    }
}
