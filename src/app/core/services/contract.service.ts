import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Contract, ContractListResponse } from '../models/corporate/contract';

export interface ContractDetailResponse {
  success: boolean;
  data: Contract;
  timestamp: string;
  metadata: any[];
}

export interface CustomInstallmentRequest {
  id?: string;
  installmentNumber: number;
  dueDate: string; // YYYY-MM-DD
  amount: number;
  status: 'PENDING_PAYMENT' | 'PAID' | 'OVERDUE' | 'CANCELLED';
}

export interface CreateStudentContractRequest {
  studentId: string;
  sellerId: string;
  startDate: string; // YYYY-MM-DD
  endDate: string;   // YYYY-MM-DD
  amount: number;
  discountPercent: number;
  includeManuals: boolean;
  includeRegistrationFee: boolean;
  adultEnglishCourseProductId: string;
  levelId: string;
  courseBookId: string;
  courseMaterialPaidSameDay: boolean;
  unitPrice: number;
  notes?: string;
  contractType: 'STANDARD' | 'PROMOTIONAL' | 'CUSTOM';
  numberOfInstallments: number;
  firstInstallmentDate: string; // YYYY-MM-DD
  customInstallments?: CustomInstallmentRequest[];
}

@Injectable({ providedIn: 'root' })
export class ContractService {
  private apiUrl = `${environment.apiUrl}`;

  constructor(private http: HttpClient) {}

  // POST /contracts
  createStudentContract(payload: CreateStudentContractRequest): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/contracts`, payload);
  }

  // GET /contracts
  getContracts(): Observable<ContractListResponse> {
    return this.http.get<ContractListResponse>(`${this.apiUrl}/contracts`);
  }

  // GET /contracts/{id}
  getContractById(contractId: string): Observable<ContractDetailResponse> {
    return this.http.get<ContractDetailResponse>(`${this.apiUrl}/contracts/${contractId}`);
  }

  // Optional helper: GET /students/{id}/contracts (if backend supports it)
  getContractsByStudent(studentId: string): Observable<ContractListResponse> {
    return this.http.get<ContractListResponse>(`${this.apiUrl}/students/${studentId}/contracts`);
  }
}
