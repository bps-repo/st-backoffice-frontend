import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Invoice, InvoiceItem } from '../models/invoice/invoice.model';

@Injectable({
  providedIn: 'root',
})
export class InvoiceService {
  private apiUrl = `${environment.apiUrl}/invoices`;

  constructor(private http: HttpClient) {}

  // Invoice CRUD operations
  getInvoices(): Observable<Invoice[]> {
    return this.http.get<Invoice[]>(this.apiUrl);
  }

  getInvoice(id: number): Observable<Invoice> {
    return this.http.get<Invoice>(`${this.apiUrl}/${id}`);
  }

  createInvoice(invoice: Invoice): Observable<Invoice> {
    return this.http.post<Invoice>(this.apiUrl, invoice);
  }

  updateInvoice(invoice: Invoice): Observable<Invoice> {
    return this.http.put<Invoice>(`${this.apiUrl}/${invoice.id}`, invoice);
  }

  deleteInvoice(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  // Invoice items operations
  getInvoiceItems(invoiceId: number): Observable<InvoiceItem[]> {
    return this.http.get<InvoiceItem[]>(`${this.apiUrl}/${invoiceId}/items`);
  }

  addItemToInvoice(invoiceId: number, item: InvoiceItem): Observable<Invoice> {
    return this.http.post<Invoice>(`${this.apiUrl}/${invoiceId}/items`, item);
  }

  updateInvoiceItem(invoiceId: number, item: InvoiceItem): Observable<InvoiceItem> {
    return this.http.put<InvoiceItem>(`${this.apiUrl}/${invoiceId}/items/${item.id}`, item);
  }

  removeItemFromInvoice(invoiceId: number, itemId: number): Observable<Invoice> {
    return this.http.delete<Invoice>(`${this.apiUrl}/${invoiceId}/items/${itemId}`);
  }

  // Invoice status operations
  markAsPaid(invoiceId: number): Observable<Invoice> {
    return this.http.patch<Invoice>(`${this.apiUrl}/${invoiceId}/status`, { status: 'paid' });
  }

  markAsCancelled(invoiceId: number): Observable<Invoice> {
    return this.http.patch<Invoice>(`${this.apiUrl}/${invoiceId}/status`, { status: 'cancelled' });
  }

  // Dashboard data
  getInvoiceStats(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/stats`);
  }

  getMonthlyInvoiceData(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/monthly-data`);
  }
}
