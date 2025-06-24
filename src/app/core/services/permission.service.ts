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
        return this.http.get<ApiResponse<PageableResponse<Permission[]>>>(this.apiUrl).pipe(
            map(response => response.data.content as Permission[]),
        );
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
