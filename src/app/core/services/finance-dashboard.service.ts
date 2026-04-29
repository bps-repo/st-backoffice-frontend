import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, map } from 'rxjs';
import { environment } from 'src/environments/environment';
import { ApiResponse } from '../models/ApiResponseService';
import { FinanceOverview, FinanceOverviewFilter } from '../models/finance/finance-overview.model';
import { InvoiceTrends, InvoiceTrendsFilter } from '../models/finance/invoice-trends.model';
import {
    PaymentDashboardFilter,
    PaymentSummary,
    PaymentTrends,
} from '../models/finance/payment-dashboard.model';
import {
    FinanceSeller,
    FinanceSellerTopRanking,
    FinanceSellersFilter,
} from '../models/finance/finance-sellers.model';

@Injectable({ providedIn: 'root' })
export class FinanceDashboardService {
    private http = inject(HttpClient);

    private apiUrl = `${environment.apiUrl}/dashboards/finance`;

    getOverview(filter: FinanceOverviewFilter = {}): Observable<FinanceOverview> {
        const today = new Date();
        const firstOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);

        let params = new HttpParams()
            .set('dateFrom', filter.dateFrom ?? this.toISODate(firstOfMonth))
            .set('dateTo', filter.dateTo ?? this.toISODate(today));

        if (filter.centerId) params = params.set('centerId', filter.centerId);

        return this.http
            .get<ApiResponse<FinanceOverview>>(`${this.apiUrl}/overview`, { params })
            .pipe(map((res) => res.data));
    }

    getInvoiceTrends(filter: InvoiceTrendsFilter): Observable<InvoiceTrends> {
        let params = new HttpParams()
            .set('dateFrom', filter.dateFrom)
            .set('dateTo', filter.dateTo);

        if (filter.centerId) params = params.set('centerId', filter.centerId);

        return this.http
            .get<ApiResponse<InvoiceTrends>>(`${this.apiUrl}/invoices/trends`, { params })
            .pipe(map((res) => res.data));
    }

    getPaymentSummary(filter: PaymentDashboardFilter): Observable<PaymentSummary> {
        let params = new HttpParams().set('dateFrom', filter.dateFrom).set('dateTo', filter.dateTo);
        if (filter.centerId) params = params.set('centerId', filter.centerId);

        return this.http
            .get<ApiResponse<PaymentSummary>>(`${this.apiUrl}/payments/summary`, { params })
            .pipe(map((res) => res.data));
    }

    getPaymentTrends(filter: PaymentDashboardFilter): Observable<PaymentTrends> {
        let params = new HttpParams().set('dateFrom', filter.dateFrom).set('dateTo', filter.dateTo);
        if (filter.centerId) params = params.set('centerId', filter.centerId);

        return this.http
            .get<ApiResponse<PaymentTrends>>(`${this.apiUrl}/payments/trends`, { params })
            .pipe(map((res) => res.data));
    }

    getFinanceSellers(filter: FinanceSellersFilter): Observable<FinanceSeller[]> {
        let params = new HttpParams().set('dateFrom', filter.dateFrom).set('dateTo', filter.dateTo);
        if (filter.centerId) params = params.set('centerId', filter.centerId);

        return this.http
            .get<ApiResponse<FinanceSeller[]>>(`${this.apiUrl}/sellers`, { params })
            .pipe(map((res) => res.data));
    }

    getFinanceSellersTop(filter: FinanceSellersFilter): Observable<FinanceSellerTopRanking[]> {
        let params = new HttpParams().set('dateFrom', filter.dateFrom).set('dateTo', filter.dateTo);
        if (filter.centerId) params = params.set('centerId', filter.centerId);

        return this.http
            .get<ApiResponse<FinanceSellerTopRanking[]>>(`${this.apiUrl}/sellers/top`, { params })
            .pipe(map((res) => res.data));
    }

    private toISODate(date: Date): string {
        return date.toISOString().split('T')[0];
    }
}
