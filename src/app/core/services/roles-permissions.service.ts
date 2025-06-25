import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { ApiResponse, PageableResponse } from './interfaces/ApiResponseService';

@Injectable({
  providedIn: 'root',
})
export class RolesPermissionsService {
  private rolesApiUrl = `${environment.apiUrl}/roles`;
  private permissionsApiUrl = `${environment.apiUrl}/permissions`;

  constructor(private http: HttpClient) {}

  // Role methods

  /**
   * Gets all roles.
   * @returns An observable containing an array of Role objects.
   */
  getRoles(): Observable<any[]> {
    return this.http.get<ApiResponse<PageableResponse<any[]>>>(this.rolesApiUrl).pipe(
      map((response) => response.data.content as any[])
    );
  }

  /**
   * Gets a role by ID.
   * @param id The ID of the role.
   * @returns An observable containing the Role object.
   */
  getRoleById(id: string): Observable<any> {
    return this.http.get<ApiResponse<any>>(`${this.rolesApiUrl}/${id}`).pipe(
      map((response) => response.data)
    );
  }

  /**
   * Creates a new role.
   * @param roleData The role data to create.
   * @returns An observable containing the created Role object.
   */
  createRole(roleData: any): Observable<any> {
    return this.http.post<ApiResponse<any>>(this.rolesApiUrl, roleData).pipe(
      map((response) => response.data)
    );
  }

  /**
   * Gets roles by name.
   * @param name The name to filter by.
   * @returns An observable containing an array of Role objects.
   */
  getRolesByName(name: string): Observable<any[]> {
    return this.http.get<ApiResponse<PageableResponse<any[]>>>(`${this.rolesApiUrl}/by-name/${name}`).pipe(
      map((response) => response.data.content as any[])
    );
  }

  /**
   * Updates a role.
   * @param id The ID of the role.
   * @param roleData The updated role data.
   * @returns An observable containing the updated Role object.
   */
  updateRole(id: string, roleData: any): Observable<any> {
    return this.http.patch<ApiResponse<any>>(`${this.rolesApiUrl}/${id}`, roleData).pipe(
      map((response) => response.data)
    );
  }

  /**
   * Deletes a role.
   * @param id The ID of the role to delete.
   * @returns An observable containing the response.
   */
  deleteRole(id: string): Observable<any> {
    return this.http.delete<ApiResponse<any>>(`${this.rolesApiUrl}/${id}`).pipe(
      map((response) => response.data)
    );
  }

  /**
   * Assigns a role to a user.
   * @param userId The ID of the user.
   * @param roleId The ID of the role.
   * @returns An observable containing the response.
   */
  assignRoleToUser(userId: string, roleId: string): Observable<any> {
    return this.http.post<ApiResponse<any>>(`${this.rolesApiUrl}/assign/${userId}/${roleId}`, {}).pipe(
      map((response) => response.data)
    );
  }

  /**
   * Removes a role from a user.
   * @param userId The ID of the user.
   * @param roleId The ID of the role.
   * @returns An observable containing the response.
   */
  removeRoleFromUser(userId: string, roleId: string): Observable<any> {
    return this.http.delete<ApiResponse<any>>(`${this.rolesApiUrl}/remove/${userId}/${roleId}`).pipe(
      map((response) => response.data)
    );
  }

  // Permission methods

  /**
   * Gets all permissions.
   * @returns An observable containing an array of Permission objects.
   */
  getPermissions(): Observable<any[]> {
    return this.http.get<ApiResponse<PageableResponse<any[]>>>(this.permissionsApiUrl).pipe(
      map((response) => response.data.content as any[])
    );
  }

  /**
   * Gets a permission by ID.
   * @param id The ID of the permission.
   * @returns An observable containing the Permission object.
   */
  getPermissionById(id: string): Observable<any> {
    return this.http.get<ApiResponse<any>>(`${this.permissionsApiUrl}/${id}`).pipe(
      map((response) => response.data)
    );
  }

  /**
   * Creates a new permission.
   * @param permissionData The permission data to create.
   * @returns An observable containing the created Permission object.
   */
  createPermission(permissionData: any): Observable<any> {
    return this.http.post<ApiResponse<any>>(this.permissionsApiUrl, permissionData).pipe(
      map((response) => response.data)
    );
  }

  /**
   * Gets permissions for a user.
   * @param userId The ID of the user.
   * @returns An observable containing an array of Permission objects.
   */
  getPermissionsByUser(userId: string): Observable<any[]> {
    return this.http.get<ApiResponse<PageableResponse<any[]>>>(`${this.permissionsApiUrl}/by-user/${userId}`).pipe(
      map((response) => response.data.content as any[])
    );
  }

  /**
   * Gets permissions for a role.
   * @param roleId The ID of the role.
   * @returns An observable containing an array of Permission objects.
   */
  getPermissionsByRole(roleId: string): Observable<any[]> {
    return this.http.get<ApiResponse<PageableResponse<any[]>>>(`${this.permissionsApiUrl}/by-role/${roleId}`).pipe(
      map((response) => response.data.content as any[])
    );
  }

  /**
   * Gets permissions by name.
   * @param name The name to filter by.
   * @returns An observable containing an array of Permission objects.
   */
  getPermissionsByName(name: string): Observable<any[]> {
    return this.http.get<ApiResponse<PageableResponse<any[]>>>(`${this.permissionsApiUrl}/by-name/${name}`).pipe(
      map((response) => response.data.content as any[])
    );
  }

  /**
   * Updates a permission.
   * @param id The ID of the permission.
   * @param permissionData The updated permission data.
   * @returns An observable containing the updated Permission object.
   */
  updatePermission(id: string, permissionData: any): Observable<any> {
    return this.http.patch<ApiResponse<any>>(`${this.permissionsApiUrl}/${id}`, permissionData).pipe(
      map((response) => response.data)
    );
  }

  /**
   * Deletes a permission.
   * @param id The ID of the permission to delete.
   * @returns An observable containing the response.
   */
  deletePermission(id: string): Observable<any> {
    return this.http.delete<ApiResponse<any>>(`${this.permissionsApiUrl}/${id}`).pipe(
      map((response) => response.data)
    );
  }

  /**
   * Assigns a permission to a role.
   * @param roleId The ID of the role.
   * @param permissionId The ID of the permission.
   * @returns An observable containing the response.
   */
  assignPermissionToRole(roleId: string, permissionId: string): Observable<any> {
    return this.http.post<ApiResponse<any>>(`${this.permissionsApiUrl}/assign/${roleId}/${permissionId}`, {}).pipe(
      map((response) => response.data)
    );
  }

  /**
   * Removes a permission from a role.
   * @param roleId The ID of the role.
   * @param permissionId The ID of the permission.
   * @returns An observable containing the response.
   */
  removePermissionFromRole(roleId: string, permissionId: string): Observable<any> {
    return this.http.delete<ApiResponse<any>>(`${this.permissionsApiUrl}/remove/${roleId}/${permissionId}`).pipe(
      map((response) => response.data)
    );
  }
}
