import {HttpClient, HttpParams} from '@angular/common/http';
import {Injectable, inject} from '@angular/core';
import {Observable} from 'rxjs';
import {environment} from 'src/environments/environment';
import {ApiResponse, PageableResponse} from '../models/ApiResponseService';
import {CreateInvoiceRequest, Invoice, InvoiceDetail, InvoiceListItem} from '../models/invoice/invoice.model';

@Injectable({
    providedIn: 'root',
})
export class InvoiceService {
    private http = inject(HttpClient);

    private apiUrl = `${environment.apiUrl}/invoices`;


    getInvoices(
        page: number = 0,
        size: number = 15,
        sort: string = 'issueDate,desc',
    ): Observable<ApiResponse<PageableResponse<InvoiceListItem>>> {
        const params = new HttpParams()
            .set('page', page.toString())
            .set('size', size.toString())
            .set('sort', sort);

        return this.http.get<ApiResponse<PageableResponse<InvoiceListItem>>>(this.apiUrl, {params});
    }

    getInvoice(id: string | number): Observable<ApiResponse<InvoiceDetail>> {
        return this.http.get<ApiResponse<InvoiceDetail>>(
            `${this.apiUrl}/${encodeURIComponent(String(id))}`,
        );
    }

    createInvoice(invoice: CreateInvoiceRequest): Observable<ApiResponse<InvoiceDetail>> {
        return this.http.post<ApiResponse<InvoiceDetail>>(this.apiUrl, invoice);
    }

    updateInvoice(invoice: Invoice): Observable<Invoice> {
        return this.http.put<Invoice>(`${this.apiUrl}/${invoice.id}`, invoice);
    }

    // Invoice status operations
    markAsPaid(invoiceId: string | number): Observable<any> {
        return this.http.patch<any>(
            `${this.apiUrl}/${encodeURIComponent(String(invoiceId))}/status`,
            {status: 'paid'},
        );
    }

    markAsCancelled(invoiceId: string | number): Observable<any> {
        return this.http.patch<any>(
            `${this.apiUrl}/${encodeURIComponent(String(invoiceId))}/status`,
            {status: 'cancelled'},
        );
    }
}
