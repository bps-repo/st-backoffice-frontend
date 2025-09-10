import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, map, Observable, of } from 'rxjs';
import { environment } from 'src/environments/environment';
import { User } from '../models/auth/user';
import { Role } from '../models/auth/role';
import { Permission } from '../models/auth/permission';
import { ApiResponse } from './interfaces/ApiResponseService';
import { UserProfileService } from './user-profile.service';

@Injectable({
    providedIn: 'root',
})
export class UserManagementService {
    private apiUrl = `${environment.apiUrl}/users`;

    constructor(private http: HttpClient, private userProfileService: UserProfileService) { }

    getUsers(): Observable<User[]> {
        return this.http.get<User[]>(this.apiUrl);
    }

    getUser(id: string): Observable<User> {
        return this.http.get<User>(`${this.apiUrl}/${id}`);
    }

    getUserByEmail(email: string): Observable<User> {
        return this.http.get<User>(`${this.apiUrl}/by-email/${email}`);
    }

    updateUser(user: User): Observable<User> {
        return this.http.put<User>(`${this.apiUrl}/${user.id}`, user);
    }

    // User roles management
    getUserRoles(userId: string): Observable<Role[]> {
        return this.http.get<Role[]>(`${this.apiUrl}/${userId}/roles`);
    }

    addRoleToUser(userId: string, roleId: string): Observable<User> {
        return this.http.post<User>(`${this.apiUrl}/${userId}/roles`, { roleId });
    }

    removeRoleFromUser(userId: string, roleId: string): Observable<User> {
        return this.http.delete<User>(`${this.apiUrl}/${userId}/roles/${roleId}`);
    }

    getUserRolesByUserId(userId: string): Observable<Role[]> {
        return this.http.get<Role[]>(`${this.apiUrl}/${userId}/roles`);
    }


    // User permissions management
    getUserPermissions(): Observable<Permission[]> {
       return this.userProfileService.getCurrentUser().pipe(
        map(user => user.allPermissions || []),
        catchError(error => {
            console.error('Error fetching user permissions:', error);
            return of([]);
        })
       );
    }

    addPermissionToUser(userId: string, permissionId: string): Observable<User> {
        return this.http.post<User>(`${this.apiUrl}/${userId}/permissions`, { permissionId });
    }

    removePermissionFromUser(userId: string, permissionId: string): Observable<User> {
        return this.http.delete<User>(`${this.apiUrl}/${userId}/permissions/${permissionId}`);
    }
}
