import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Permission } from '../models/auth/permission';

@Injectable({
  providedIn: 'root',
})
export class PermissionService {
  private apiUrl = `${environment.apiUrl}/permissions`;

  constructor(private http: HttpClient) {}

  getPermissions(): Observable<Permission[]> {
    return this.http.get<Permission[]>(this.apiUrl);
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
