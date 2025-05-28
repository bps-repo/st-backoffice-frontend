import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Role } from '../models/auth/role';
import { Permission } from '../models/auth/permission';

@Injectable({
  providedIn: 'root',
})
export class RoleService {
  private apiUrl = `${environment.apiUrl}/roles`;

  constructor(private http: HttpClient) {}

  getRoles(): Observable<Role[]> {
    return this.http.get<Role[]>(this.apiUrl);
  }

  getRole(id: number): Observable<Role> {
    return this.http.get<Role>(`${this.apiUrl}/${id}`);
  }

  createRole(role: Role): Observable<Role> {
    return this.http.post<Role>(this.apiUrl, role);
  }

  updateRole(role: Role): Observable<Role> {
    return this.http.put<Role>(`${this.apiUrl}/${role.id}`, role);
  }

  deleteRole(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  addPermissionToRole(roleId: number, permissionId: number): Observable<Role> {
    return this.http.post<Role>(`${this.apiUrl}/${roleId}/permissions`, { permissionId });
  }

  removePermissionFromRole(roleId: number, permissionId: number): Observable<Role> {
    return this.http.delete<Role>(`${this.apiUrl}/${roleId}/permissions/${permissionId}`);
  }
}
