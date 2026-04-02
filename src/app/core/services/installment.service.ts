import {Injectable, inject} from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import {Observable} from 'rxjs';
import {map} from 'rxjs/operators';
import {environment} from 'src/environments/environment';
import {Installment} from '../models/payment/installment';
import {ApiResponse, PageableResponse} from "../models/ApiResponseService";

@Injectable({providedIn: 'root'})
export class InstallmentService {
    private http = inject(HttpClient);

    private apiUrl = `${environment.apiUrl}/installments`;

    makePayment(installmentId: string, payload: any): Observable<ApiResponse<Installment>> {
        return this.http.post<ApiResponse<Installment>>(`${this.apiUrl}/${installmentId}/pay`, payload);
    }

    updateInstallment(
        installmentId: string,
        payload: Partial<Pick<Installment, 'amount' | 'dueDate' | 'installmentNumber'>>
    ): Observable<ApiResponse<Installment>> {
        return this.http.patch<ApiResponse<Installment>>(`${this.apiUrl}/${installmentId}`, payload);
    }

    getInstallments(page: number = 0, size: number = 15, sort: string = 'dueDate,asc'):
        Observable<PageableResponse<Installment>> {
        const params = new HttpParams()
            .set('page', page.toString())
            .set('size', size.toString())
            .set('sort', sort);

        return this.http.get<PageableResponse<Installment>>(this.apiUrl, {params})
    }
}
