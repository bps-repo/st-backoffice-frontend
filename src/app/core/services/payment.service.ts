import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { ApiResponse, PageableResponse } from '../models/ApiResponseService';
import { EntityPayment, PaymentEntityType } from '../models/payment/installment';

@Injectable({ providedIn: 'root' })
export class PaymentService {
    private http = inject(HttpClient);

    private apiUrl = `${environment.apiUrl}/payments`;

    /**
     * Paginated list of all payments.
     * GET {{baseUrl}}/payments
     */
    getPayments(
        page: number = 0,
        size: number = 15,
        sort: string = 'paymentDate,desc',
    ): Observable<ApiResponse<PageableResponse<EntityPayment>>> {
        const params = new HttpParams()
            .set('page', page.toString())
            .set('size', size.toString())
            .set('sort', sort);

        return this.http.get<ApiResponse<PageableResponse<EntityPayment>>>(this.apiUrl, { params });
    }

    /**
     * Fetches a single payment by id.
     * GET {{baseUrl}}/payments/:id
     */
    getPayment(id: string): Observable<ApiResponse<EntityPayment>> {
        return this.http.get<ApiResponse<EntityPayment>>(`${this.apiUrl}/${encodeURIComponent(id)}`);
    }

    /**
     * Fetches every payment registered against the given entity (INSTALLMENT, CONTRACT, ...).
     * GET {{baseUrl}}/payments/entity/:entity/:id
     */
    getPaymentsByEntity(
        entityType: PaymentEntityType | string,
        entityId: string,
    ): Observable<ApiResponse<EntityPayment[]>> {
        const entity = encodeURIComponent(entityType);
        const id = encodeURIComponent(entityId);
        return this.http.get<ApiResponse<EntityPayment[]>>(
            `${this.apiUrl}/entity/${entity}/${id}`,
        );
    }
}
