import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {Observable, of} from 'rxjs';
import {map} from 'rxjs/operators';
import {environment} from 'src/environments/environment';
import {ApiResponse, PageableResponse} from '../models/ApiResponseService';
import {Employee, EmployeeStatus, CreateEmployeeRequest, EmployeeDetails} from '../models/corporate/employee';

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
    getEmployees(): Observable<Employee[]> {
        return this.http.get<ApiResponse<PageableResponse<any[]>>>(this.apiUrl).pipe(
            map((response) => response.data.content as Employee[])
        );
    }

    /**
     * Creates a new employee.
     * @param employeeData The employee data to create following the new structure.
     * @returns An observable containing the created Employee object.
     */
    createEmployee(employeeData: CreateEmployeeRequest): Observable<Employee> {
        return this.http.post<ApiResponse<Employee>>(this.apiUrl, employeeData).pipe(
            map((response) => response.data)
        );
    }

    /**
     * Gets an employee by ID.
     * @param id The ID of the employee.
     * @returns An observable containing the Employee object.
     */
    getEmployeeById(id: string): Observable<Employee> {
        return this.http.get<ApiResponse<any>>(`${this.apiUrl}/${id}`).pipe(
            map((response) => response.data as Employee)
        );
    }

    /**
     * Gets detailed employee information by ID.
     * @param id The ID of the employee.
     * @returns An observable containing the EmployeeDetails object.
     */
    getEmployeeDetails(id: string): Observable<EmployeeDetails> {
        return this.http.get<ApiResponse<any>>(`${this.apiUrl}/${id}/details`).pipe(
            map((response) => response.data as EmployeeDetails)
        );
    }

    /**
     * Gets employees by role.
     * @param role The role to filter by.
     * @returns An observable containing an array of Employee objects.
     */
    getEmployeesByRole(role: string): Observable<Employee[]> {
        return this.searchEmployees({ roleName: role });
    }

    /**
     * Gets employees by center.
     * @param centerId The ID of the center.
     * @returns An observable containing an array of Employee objects.
     */
    getEmployeesByCenter(centerId: string): Observable<Employee[]> {
        // Updated to use search endpoint: GET /employees/search?centerId={centerId}
        return this.searchEmployees({ centerId });
    }

    /**
     * Updates an employee.
     * @param id The ID of the employee.
     * @param employeeData The updated employee data.
     * @returns An observable containing the updated Employee object.
     */
    updateEmployee(id: string, employeeData: Employee): Observable<Employee> {
        return this.http.patch<ApiResponse<any>>(`${this.apiUrl}/${id}`, employeeData).pipe(
            map((response) => response.data as Employee)
        );
    }

    /**
     * Updates an employee's status.
     * @param id The ID of the employee.
     * @param status The new status.
     * @returns An observable containing the updated Employee object.
     */
    updateEmployeeStatus(id: string, status: EmployeeStatus): Observable<Employee> {
        return this.http.patch<ApiResponse<any>>(`${this.apiUrl}/${id}/status`, status).pipe(
            map((response) => response.data as Employee)
        );
    }

    /**
     * Deletes an employee.
     * @param id The ID of the employee to delete.
     * @returns An observable containing the response.
     */
    deleteEmployee(id: string): Observable<Employee> {
        return this.http.delete<ApiResponse<any>>(`${this.apiUrl}/${id}`).pipe(
            map((response) => response.data as Employee)
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
    /**
     * Gets employees by status.
     * @param status The status to filter by (e.g., ACTIVE).
     */
    getEmployeesByStatus(status: string): Observable<Employee[]> {
        // New endpoint: GET /employees/status/{status}
        return this.http.get<ApiResponse<any[]>>(`${this.apiUrl}/status/${status}`).pipe(
            map((response) => response.data as Employee[])
        );
    }

    /**
     * Search employees with flexible filters (non-paginated).
     * Example: status=ACTIVE&centerId=uuid&roleName=TEACHER&minWage=1000
     */
    searchEmployees(filters: {
        status?: string;
        centerId?: string;
        roleName?: string;
        minWage?: number;
        emailContains?: string;
        [key: string]: any;
    }): Observable<Employee[]> {
        const params = new URLSearchParams();
        Object.entries(filters || {}).forEach(([k, v]) => {
            if (v !== undefined && v !== null && v !== '') params.set(k, String(v));
        });
        const url = `${this.apiUrl}/search${params.toString() ? `?${params.toString()}` : ''}`;
        return this.http.get<ApiResponse<any[]>>(url).pipe(
            map(res => res.data as Employee[])
        );
    }

    /**
     * Search employees with pagination.
     * Example: /employees/search/paginated?emailContains=john&page=0&size=10&sort=hiringDate
     */
    searchEmployeesPaginated(
        filters: { [key: string]: any },
        page: number,
        size: number,
        sort?: string
    ): Observable<PageableResponse<Employee[]>> {
        const params = new URLSearchParams();
        Object.entries(filters || {}).forEach(([k, v]) => {
            if (v !== undefined && v !== null && v !== '') params.set(k, String(v));
        });
        params.set('page', String(page));
        params.set('size', String(size));
        if (sort) params.set('sort', sort);
        const url = `${this.apiUrl}/search/paginated?${params.toString()}`;
        return this.http.get<ApiResponse<PageableResponse<any[]>>>(url).pipe(
            map(res => res.data as PageableResponse<Employee[]>)
        );
    }
}
