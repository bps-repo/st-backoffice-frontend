import {Injectable, inject} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {map} from 'rxjs/operators';
import {Company, CreateCompany} from 'src/app/core/models/corporate/company';
import {environment} from '../../../environments/environment';
import {ApiResponse, PageableResponse} from '../models/ApiResponseService';

@Injectable({
    providedIn: 'root'
})
export class CompanyService {
    private http = inject(HttpClient);
    private apiUrl = `${environment.apiUrl}/companies`;

    getAllCompanies(): Observable<Company[]> {
        return this.http.get<ApiResponse<PageableResponse<Company>>>(this.apiUrl).pipe(
            map(response => response.data.content)
        );
    }

    getCompanyById(id: string): Observable<Company> {
        return this.http.get<ApiResponse<Company>>(`${this.apiUrl}/${id}`).pipe(
            map(response => response.data as Company)
        );
    }

    createCompany(company: CreateCompany): Observable<Company> {
        return this.http.post<ApiResponse<Company>>(this.apiUrl, company).pipe(
            map(response => response.data as Company)
        );
    }

    updateCompany(id: string, company: Partial<Company>): Observable<Company> {
        return this.http.patch<ApiResponse<Company>>(`${this.apiUrl}/${id}`, company).pipe(
            map(response => response.data as Company)
        );
    }

    deleteCompany(id: string): Observable<void> {
        return this.http.delete<void>(`${this.apiUrl}/${id}`);
    }
}
