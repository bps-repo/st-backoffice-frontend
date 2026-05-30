import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Contract, ContractListFilter, CreateStudentContractRequest } from '../models/corporate/contract';
import { ApiResponse, PageableResponse } from '../models/ApiResponseService';

@Injectable({ providedIn: 'root' })
export class ContractService {
    private http = inject(HttpClient);
    private apiUrl = `${environment.apiUrl}/contracts`;

    getContracts(filter: ContractListFilter = {}): Observable<PageableResponse<Contract>> {
        let params = new HttpParams();

        if (filter.status)       params = params.set('status', filter.status);
        if (filter.contractType) params = params.set('contractType', filter.contractType);
        if (filter.courseType)   params = params.set('courseType', filter.courseType);
        if (filter.studentName?.trim()) params = params.set('studentName', filter.studentName.trim());
        params = params.set('page', String(filter.page ?? 0));
        params = params.set('size', String(filter.size ?? 10));
        params = params.set('sort', filter.sort ?? 'startDate,desc');

        return this.http
            .get<ApiResponse<PageableResponse<Contract>>>(this.apiUrl, { params })
            .pipe(map(res => res.data as PageableResponse<Contract>));
    }

    createStudentContract(payload: CreateStudentContractRequest): Observable<Contract> {
        return this.http
            .post<ApiResponse<Contract>>(this.apiUrl, payload)
            .pipe(map(res => res.data as Contract));
    }

    getContractById(contractId: string): Observable<Contract> {
        return this.http
            .get<ApiResponse<Contract>>(`${this.apiUrl}/${contractId}`)
            .pipe(map(res => res.data as Contract));
    }

    getContractsByStudent(studentId: string): Observable<Contract[]> {
        return this.http
            .get<ApiResponse<Contract[]>>(`${this.apiUrl}/student/${studentId}`)
            .pipe(map(res => res.data as Contract[]));
    }

    downloadContract(contractId: string): Observable<Blob> {
        return this.http.get(`${this.apiUrl}/${contractId}/pdf`, { responseType: 'blob' });
    }
}
