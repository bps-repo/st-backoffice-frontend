import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Contract, CreateStudentContractRequest } from '../models/corporate/contract';
import { ApiResponse } from '../models/ApiResponseService';

@Injectable({ providedIn: 'root' })
export class ContractService {
    private apiUrl = `${environment.apiUrl}/contracts`;

    constructor(private http: HttpClient) { }

    createStudentContract(payload: CreateStudentContractRequest): Observable<Contract> {
        return this.http.post<ApiResponse<Contract>>(`${this.apiUrl}`, payload).pipe(
            map(response => response.data as Contract)
        );
    }

    getContracts(): Observable<Contract[]> {
        return this.http.get<ApiResponse<Contract[]>>(`${this.apiUrl}`).pipe(
            map(response => response.data as Contract[])
        );
    }

    getContractById(contractId: string): Observable<Contract> {
        return this.http.get<ApiResponse<Contract>>(`${this.apiUrl}/${contractId}`).pipe(
            map(response => response.data as Contract)
        );
    }

    getContractsByStudent(studentId: string): Observable<Contract[]> {
        return this.http.get<ApiResponse<Contract[]>>(`${this.apiUrl}/students/${studentId}/contracts`).pipe(
            map(response => response.data as Contract[])
        );
    }
}
