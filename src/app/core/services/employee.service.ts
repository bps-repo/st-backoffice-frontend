import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {Observable, of} from 'rxjs';
import {map} from 'rxjs/operators';
import {environment} from 'src/environments/environment';
import {ApiResponse, PageableResponse} from './interfaces/ApiResponseService';
import {Employee} from "../models/corporate/employee";

@Injectable({
    providedIn: 'root',
})
export class EmployeeService {
    private apiUrl = `${environment.apiUrl}/employees`;

    constructor(private http: HttpClient) {
    }

    /**
     * Gets all employees.
     * @returns An observable containing an array of Employee objects.
     */
    getEmployees(): Observable<any[]> {
        return this.http.get<ApiResponse<PageableResponse<any[]>>>(this.apiUrl).pipe(
            map((response) => response.data.content as any[])
        );
    }

    /**
     * Creates a new employee.
     * @param employeeData The employee data to create.
     * @returns An observable containing the created Employee object.
     */
    createEmployee(employeeData: any): Observable<any> {
        return this.http.post<ApiResponse<any>>(this.apiUrl, employeeData).pipe(
            map((response) => response.data)
        );
    }

    /**
     * Gets an employee by ID.
     * @param id The ID of the employee.
     * @returns An observable containing the Employee object.
     */
    getEmployeeById(id: string): Observable<any> {
        return this.http.get<ApiResponse<any>>(`${this.apiUrl}/${id}`).pipe(
            map((response) => response.data)
        );
    }

    /**
     * Gets employees by department.
     * @param department The department to filter by.
     * @returns An observable containing an array of Employee objects.
     */
    getEmployeesByDepartment(department: string): Observable<any[]> {
        return this.http.get<ApiResponse<PageableResponse<any[]>>>(`${this.apiUrl}/by-department/${department}`).pipe(
            map((response) => response.data.content as any[])
        );
    }

    /**
     * Gets employees by role.
     * @param role The role to filter by.
     * @returns An observable containing an array of Employee objects.
     */
    getEmployeesByRole(role: string): Observable<any[]> {
        return this.http.get<ApiResponse<PageableResponse<any[]>>>(`${this.apiUrl}/by-role/${role}`).pipe(
            map((response) => response.data.content as any[])
        );
    }

    /**
     * Gets employees by center.
     * @param centerId The ID of the center.
     * @returns An observable containing an array of Employee objects.
     */
    getEmployeesByCenter(centerId: string): Observable<any[]> {
        return this.http.get<ApiResponse<PageableResponse<any[]>>>(`${this.apiUrl}/by-center/${centerId}`).pipe(
            map((response) => response.data.content as any[])
        );
    }

    /**
     * Updates an employee.
     * @param id The ID of the employee.
     * @param employeeData The updated employee data.
     * @returns An observable containing the updated Employee object.
     */
    updateEmployee(id: string, employeeData: any): Observable<any> {
        return this.http.patch<ApiResponse<any>>(`${this.apiUrl}/${id}`, employeeData).pipe(
            map((response) => response.data)
        );
    }

    /**
     * Updates an employee's status.
     * @param id The ID of the employee.
     * @param status The new status.
     * @returns An observable containing the updated Employee object.
     */
    updateEmployeeStatus(id: string, status: any): Observable<any> {
        return this.http.patch<ApiResponse<any>>(`${this.apiUrl}/${id}/status`, status).pipe(
            map((response) => response.data)
        );
    }

    /**
     * Deletes an employee.
     * @param id The ID of the employee to delete.
     * @returns An observable containing the response.
     */
    deleteEmployee(id: string): Observable<any> {
        return this.http.delete<ApiResponse<any>>(`${this.apiUrl}/${id}`).pipe(
            map((response) => response.data)
        );
    }

    getEmployee(employeeId: string) {
        return undefined;
    }

    assignRoleToEmployee(employeeId: string, id: string): Observable<Employee> {
        return of()
    }

    removeRoleFromEmployee(employeeId: string, id: string): Observable<Employee> {
        return of()
    }
}
