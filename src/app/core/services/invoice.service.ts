import {HttpClient} from '@angular/common/http';
import {Injectable, inject} from '@angular/core';
import {Observable} from 'rxjs';
import {environment} from 'src/environments/environment';
import {Invoice, InvoiceItem} from '../models/invoice/invoice.model';

@Injectable({
    providedIn: 'root',
})
export class InvoiceService {
    private http = inject(HttpClient);

    private apiUrl = `${environment.apiUrl}/invoices`;


    getInvoice(id: number): Observable<Invoice> {
        return this.http.get<Invoice>(`${this.apiUrl}/${id}`);
    }

    createInvoice(invoice: Invoice): Observable<Invoice> {
        return this.http.post<Invoice>(this.apiUrl, invoice);
    }

    updateInvoice(invoice: Invoice): Observable<Invoice> {
        return this.http.put<Invoice>(`${this.apiUrl}/${invoice.id}`, invoice);
    }

    // Invoice status operations
    markAsPaid(invoiceId: number): Observable<Invoice> {
        return this.http.patch<Invoice>(`${this.apiUrl}/${invoiceId}/status`, {status: 'paid'});
    }

    markAsCancelled(invoiceId: number): Observable<Invoice> {
        return this.http.patch<Invoice>(`${this.apiUrl}/${invoiceId}/status`, {status: 'cancelled'});
    }
}
