import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {environment} from 'src/environments/environment';
import {Employee} from '../models/corporate/employee';
import {ApiResponse, PageableResponse} from "./interfaces/ApiResponseService";
import {map} from "rxjs/operators";

@Injectable({
    providedIn: 'root',
})
export class EmployeeService {
    private apiUrl = `${environment.apiUrl}/employees`;

    constructor(private http: HttpClient) {
    }

    getEmployees(): Observable<Employee[]> {
        return this.http.get<ApiResponse<PageableResponse<Employee[]>>>(this.apiUrl).pipe(
            map((r) => r.data.content as Employee[])
        );
    }

    getEmployee(id: string): Observable<Employee> {
        return this.http.get<Employee>(`${this.apiUrl}/${id}`).pipe(
            map((r) => r as Employee)
        );
    }

    createEmployee(employee: Employee): Observable<Employee> {
        return this.http.post<Employee>(this.apiUrl, employee).pipe(
            map((r) => r as Employee)
        );
    }

    updateEmployee(employee: Employee): Observable<Employee> {
        return this.http.put<Employee>(`${this.apiUrl}/${employee.id}`, employee).pipe(
            map((r) => r as Employee)
        );
    }

    deleteEmployee(id: string): Observable<void> {
        return this.http.delete<void>(`${this.apiUrl}/${id}`);
    }

    assignRoleToEmployee(employeeId: string, roleId: number): Observable<Employee> {
        return this.http.post<Employee>(`${this.apiUrl}/${employeeId}/roles`, {roleId}).pipe(
            map((r) => r as Employee)
        );
    }

    removeRoleFromEmployee(employeeId: string, roleId: number): Observable<Employee> {
        return this.http.delete<Employee>(`${this.apiUrl}/${employeeId}/roles/${roleId}`).pipe(
            map((r) => r as Employee)
        );
    }
}
