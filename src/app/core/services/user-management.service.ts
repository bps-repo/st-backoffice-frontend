import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { User } from '../models/auth/user';
import { Role } from '../models/auth/role';
import { Permission } from '../models/auth/permission';

@Injectable({
  providedIn: 'root',
})
export class UserManagementService {
  private apiUrl = `${environment.apiUrl}/users`;

  constructor(private http: HttpClient) {}

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

  addRoleToUser(userId: string, roleId: number): Observable<User> {
    return this.http.post<User>(`${this.apiUrl}/${userId}/roles`, { roleId });
  }

  removeRoleFromUser(userId: string, roleId: number): Observable<User> {
    return this.http.delete<User>(`${this.apiUrl}/${userId}/roles/${roleId}`);
  }

  // User permissions management
  getUserPermissions(userId: string): Observable<Permission[]> {
    return this.http.get<Permission[]>(`${this.apiUrl}/${userId}/permissions`);
  }

  addPermissionToUser(userId: string, permissionId: number): Observable<User> {
    return this.http.post<User>(`${this.apiUrl}/${userId}/permissions`, { permissionId });
  }

  removePermissionFromUser(userId: string, permissionId: number): Observable<User> {
    return this.http.delete<User>(`${this.apiUrl}/${userId}/permissions/${permissionId}`);
  }
}
