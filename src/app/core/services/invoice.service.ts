import { Injectable } from '@angular/core';
import { Invoice } from '../models/invoice';
import { BaseService } from './base.service';
import { HttpClient } from '@angular/common/http';
import { PATH_TO_MOCK_DATA } from 'src/app/shared/constants/app';
import { map, Observable } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class InvoiceService extends BaseService<number, Invoice> {
    constructor(httpClient: HttpClient) {
        super(httpClient, PATH_TO_MOCK_DATA + 'invoices.json');
    }

    getInvoices(): Observable<Invoice[]> {
        return this.getAll();
    }

    getInvoiceById(id: number): Observable<Invoice | undefined> {
        return this.getAll().pipe(
            map((invoices) =>
                invoices.find((invoice) => invoice.customer?.id === id)
            )
        );
    }
}
