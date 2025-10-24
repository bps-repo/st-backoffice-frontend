import {Injectable} from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import {Observable} from 'rxjs';
import {map} from 'rxjs/operators';
import {environment} from 'src/environments/environment';
import {ApiResponse, Installment, Pageable} from '../models/payment/installment';

@Injectable({providedIn: 'root'})
export class InstallmentService {
    private apiUrl = `${environment.apiUrl}/installments`;

    constructor(private http: HttpClient) {
    }

    makePayment(installmentId: string, payload: any): Observable<ApiResponse<Installment>> {
        console.log("payload: ", payload)
        return this.http.post<ApiResponse<Installment>>(`${this.apiUrl}/${installmentId}/pay`, payload);
    }

    getInstallments(page: number = 0, size: number = 15, sort: string = 'dueDate,asc'):
        Observable<{ content: Installment[]; totalElements: number; page: number; size: number; totalPages: number; }> {
        const params = new HttpParams()
            .set('page', page.toString())
            .set('size', size.toString())
            .set('sort', sort);

        return this.http.get<ApiResponse<Pageable<Installment>>>(this.apiUrl, {params}).pipe(
            map((response) => {
                const data = response.data;
                return {
                    content: data.content,
                    totalElements: data.totalElements,
                    totalPages: data.totalPages,
                    page: data.number,
                    size: data.size,
                };
            })
        );
    }
}
