import {HttpClient} from '@angular/common/http';
import {Injectable, inject} from '@angular/core';
import {Observable, of} from 'rxjs';
import {map} from 'rxjs/operators';
import {environment} from 'src/environments/environment';
import {ApiResponse, PageableResponse} from "../../models/ApiResponseService";
import {CreateEmployeeRequest, Employee, EmployeeStatus} from "../../models/corporate/employee";

@Injectable({
    providedIn: 'root',
})
export class EmployeeService {
    private http = inject(HttpClient);

    private apiUrl = `${environment.apiUrl}/employees`;

    getEmployees(): Observable<Employee[]> {
        return this.http.get<ApiResponse<PageableResponse<Employee>>>(this.apiUrl).pipe(
            map((response) => response.data.content)
        );
    }

    createEmployee(employeeData: CreateEmployeeRequest): Observable<Employee> {
        return this.http.post<ApiResponse<Employee>>(this.apiUrl, employeeData).pipe(
            map((response) => response.data)
        );
    }

    getEmployeeById(id: string): Observable<Employee> {
        return this.http.get<ApiResponse<Employee>>(`${this.apiUrl}/${id}`).pipe(
            map((response) => response.data as Employee)
        );
    }

    getEmployeesByRole(role: string): Observable<Employee[]> {
        return this.searchEmployees({roleName: role});
    }


    getEmployeesByCenter(centerId: string): Observable<Employee[]> {
        // Updated to use search endpoint: GET /employees/search?centerId={centerId}
        return this.searchEmployees({centerId});
    }

    updateEmployee(id: string, employeeData: Employee): Observable<Employee> {
        return this.http.patch<ApiResponse<any>>(`${this.apiUrl}/${id}`, employeeData).pipe(
            map((response) => response.data as Employee)
        );
    }

    updateEmployeeStatus(id: string, status: EmployeeStatus): Observable<Employee> {
        return this.http.patch<ApiResponse<any>>(`${this.apiUrl}/${id}/status`, status).pipe(
            map((response) => response.data as Employee)
        );
    }

    deleteEmployee(id: string): Observable<Employee> {
        return this.http.delete<ApiResponse<any>>(`${this.apiUrl}/${id}`).pipe(
            map((response) => response.data as Employee)
        );
    }

    getEmployeesByStatus(status: string): Observable<Employee[]> {
        return this.http.get<ApiResponse<any[]>>(`${this.apiUrl}/status/${status}`).pipe(
            map((response) => response.data as Employee[])
        );
    }

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
