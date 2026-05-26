import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, map } from 'rxjs';
import { environment } from 'src/environments/environment';
import { ApiResponse } from '../models/ApiResponseService';
import { FinanceOverview, FinanceOverviewFilter } from '../models/finance/finance-overview.model';
import { InvoiceTrends, InvoiceTrendsFilter } from '../models/finance/invoice-trends.model';
import {
    FinanceContractReportRow,
    FinanceContractsReportFilter,
} from '../models/finance/contracts-report.model';
import {
    FinanceCustomerReportRow,
    FinanceCustomersReportFilter,
} from '../models/finance/customers-report.model';
import {
    FinanceInvoiceReportRow,
    FinanceInvoicesReportFilter,
} from '../models/finance/invoices-report.model';
import {
    FinanceSellerReportRow,
    FinanceSellersReportFilter,
} from '../models/finance/sellers-report.model';
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
import { PageableResponse } from '../models/ApiResponseService';
import { CenterRevenue, CenterRevenueFilter } from '../models/finance/center-revenue.model';
import { SellerEvolution, SellerEvolutionFilter } from '../models/finance/seller-evolution.model';
import { AnalyticsGrowth, AnalyticsGrowthFilter } from '../models/finance/analytics-growth.model';
import { AnalyticsHeatmap, AnalyticsHeatmapFilter } from '../models/finance/analytics-heatmap.model';
import { AnalyticsCashflow, AnalyticsCashflowFilter } from '../models/finance/analytics-cashflow.model';

export type ExportFormat = 'pdf' | 'csv' | 'excel';

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

    exportOverview(filter: FinanceOverviewFilter = {}, format: ExportFormat): Observable<Blob> {
        const today = new Date();
        const firstOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);

        let params = new HttpParams()
            .set('dateFrom', filter.dateFrom ?? this.toISODate(firstOfMonth))
            .set('dateTo', filter.dateTo ?? this.toISODate(today))
            .set('format', format);

        if (filter.centerId) params = params.set('centerId', filter.centerId);

        return this.http.get(`${this.apiUrl}/overview/export`, { params, responseType: 'blob' });
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

    exportInvoiceTrends(filter: InvoiceTrendsFilter, format: ExportFormat): Observable<Blob> {
        let params = new HttpParams()
            .set('dateFrom', filter.dateFrom)
            .set('dateTo', filter.dateTo)
            .set('format', format);
        if (filter.centerId) params = params.set('centerId', filter.centerId);

        return this.http.get(`${this.apiUrl}/invoices/trends/export`, { params, responseType: 'blob' });
    }

    getPaymentSummary(filter: PaymentDashboardFilter): Observable<PaymentSummary> {
        let params = new HttpParams().set('dateFrom', filter.dateFrom).set('dateTo', filter.dateTo);
        if (filter.centerId) params = params.set('centerId', filter.centerId);

        return this.http
            .get<ApiResponse<PaymentSummary>>(`${this.apiUrl}/payments/summary`, { params })
            .pipe(map((res) => res.data));
    }

    exportPaymentSummary(filter: PaymentDashboardFilter, format: ExportFormat): Observable<Blob> {
        let params = new HttpParams()
            .set('dateFrom', filter.dateFrom)
            .set('dateTo', filter.dateTo)
            .set('format', format);
        if (filter.centerId) params = params.set('centerId', filter.centerId);

        return this.http.get(`${this.apiUrl}/payments/summary/export`, { params, responseType: 'blob' });
    }

    getPaymentTrends(filter: PaymentDashboardFilter): Observable<PaymentTrends> {
        let params = new HttpParams().set('dateFrom', filter.dateFrom).set('dateTo', filter.dateTo);
        if (filter.centerId) params = params.set('centerId', filter.centerId);

        return this.http
            .get<ApiResponse<PaymentTrends>>(`${this.apiUrl}/payments/trends`, { params })
            .pipe(map((res) => res.data));
    }

    exportPaymentTrends(filter: PaymentDashboardFilter, format: ExportFormat): Observable<Blob> {
        let params = new HttpParams()
            .set('dateFrom', filter.dateFrom)
            .set('dateTo', filter.dateTo)
            .set('format', format);
        if (filter.centerId) params = params.set('centerId', filter.centerId);

        return this.http.get(`${this.apiUrl}/payments/trends/export`, { params, responseType: 'blob' });
    }

    getFinanceSellers(filter: FinanceSellersFilter): Observable<FinanceSeller[]> {
        let params = new HttpParams().set('dateFrom', filter.dateFrom).set('dateTo', filter.dateTo);
        if (filter.centerId) params = params.set('centerId', filter.centerId);

        return this.http
            .get<ApiResponse<FinanceSeller[]>>(`${this.apiUrl}/sellers`, { params })
            .pipe(map((res) => res.data));
    }

    exportFinanceSellers(filter: FinanceSellersFilter, format: ExportFormat): Observable<Blob> {
        let params = new HttpParams()
            .set('dateFrom', filter.dateFrom)
            .set('dateTo', filter.dateTo)
            .set('format', format);
        if (filter.centerId) params = params.set('centerId', filter.centerId);

        return this.http.get(`${this.apiUrl}/sellers/export`, { params, responseType: 'blob' });
    }

    getFinanceSellersTop(filter: FinanceSellersFilter): Observable<FinanceSellerTopRanking[]> {
        let params = new HttpParams().set('dateFrom', filter.dateFrom).set('dateTo', filter.dateTo);
        if (filter.centerId) params = params.set('centerId', filter.centerId);

        return this.http
            .get<ApiResponse<FinanceSellerTopRanking[]>>(`${this.apiUrl}/sellers/top`, { params })
            .pipe(map((res) => res.data));
    }

    exportFinanceSellersTop(filter: FinanceSellersFilter, format: ExportFormat): Observable<Blob> {
        let params = new HttpParams()
            .set('dateFrom', filter.dateFrom)
            .set('dateTo', filter.dateTo)
            .set('format', format);
        if (filter.centerId) params = params.set('centerId', filter.centerId);

        return this.http.get(`${this.apiUrl}/sellers/top/export`, { params, responseType: 'blob' });
    }

    getFinanceContractsReport(
        filter: FinanceContractsReportFilter,
    ): Observable<PageableResponse<FinanceContractReportRow>> {
        let params = new HttpParams().set('dateFrom', filter.dateFrom).set('dateTo', filter.dateTo);

        if (filter.centerId) params = params.set('centerId', filter.centerId);
        if (filter.sellerId) params = params.set('sellerId', filter.sellerId);

        if (filter.status?.length) {
            filter.status.forEach((status) => {
                params = params.append('status', status);
            });
        }

        if (filter.contractType?.length) {
            filter.contractType.forEach((contractType) => {
                params = params.append('contractType', contractType);
            });
        }

        params = params.set('page', String(filter.page ?? 0)).set('size', String(filter.size ?? 20));

        return this.http
            .get<ApiResponse<PageableResponse<FinanceContractReportRow>>>(
                `${environment.apiUrl}/reports/finance/contracts`,
                { params },
            )
            .pipe(map((res) => res.data));
    }

    exportFinanceContractsReport(filter: FinanceContractsReportFilter, format: ExportFormat): Observable<Blob> {
        let params = new HttpParams()
            .set('dateFrom', filter.dateFrom)
            .set('dateTo', filter.dateTo)
            .set('format', format);

        if (filter.centerId) params = params.set('centerId', filter.centerId);
        if (filter.sellerId) params = params.set('sellerId', filter.sellerId);
        if (filter.status?.length) filter.status.forEach((status) => (params = params.append('status', status)));
        if (filter.contractType?.length)
            filter.contractType.forEach((contractType) => (params = params.append('contractType', contractType)));

        return this.http.get(`${environment.apiUrl}/reports/finance/contracts/export`, { params, responseType: 'blob' });
    }

    getFinanceCustomersReport(
        filter: FinanceCustomersReportFilter,
    ): Observable<PageableResponse<FinanceCustomerReportRow>> {
        let params = new HttpParams().set('dateFrom', filter.dateFrom).set('dateTo', filter.dateTo);

        if (filter.centerId) params = params.set('centerId', filter.centerId);

        params = params.set('page', String(filter.page ?? 0)).set('size', String(filter.size ?? 20));

        return this.http
            .get<ApiResponse<PageableResponse<FinanceCustomerReportRow>>>(
                `${environment.apiUrl}/reports/finance/customers`,
                { params },
            )
            .pipe(map((res) => res.data));
    }

    exportFinanceCustomersReport(filter: FinanceCustomersReportFilter, format: ExportFormat): Observable<Blob> {
        let params = new HttpParams()
            .set('dateFrom', filter.dateFrom)
            .set('dateTo', filter.dateTo)
            .set('format', format);
        if (filter.centerId) params = params.set('centerId', filter.centerId);

        return this.http.get(`${environment.apiUrl}/reports/finance/customers/export`, { params, responseType: 'blob' });
    }

    getFinanceInvoicesReport(
        filter: FinanceInvoicesReportFilter,
    ): Observable<PageableResponse<FinanceInvoiceReportRow>> {
        let params = new HttpParams().set('dateFrom', filter.dateFrom).set('dateTo', filter.dateTo);

        if (filter.centerId) params = params.set('centerId', filter.centerId);

        if (filter.documentType?.length) {
            filter.documentType.forEach((documentType) => {
                params = params.append('documentType', documentType);
            });
        }

        if (filter.paymentStatus?.length) {
            filter.paymentStatus.forEach((paymentStatus) => {
                params = params.append('paymentStatus', paymentStatus);
            });
        }

        params = params.set('page', String(filter.page ?? 0)).set('size', String(filter.size ?? 20));

        return this.http
            .get<ApiResponse<PageableResponse<FinanceInvoiceReportRow>>>(
                `${environment.apiUrl}/reports/finance/invoices`,
                { params },
            )
            .pipe(map((res) => res.data));
    }

    exportFinanceInvoicesReport(filter: FinanceInvoicesReportFilter, format: ExportFormat): Observable<Blob> {
        let params = new HttpParams()
            .set('dateFrom', filter.dateFrom)
            .set('dateTo', filter.dateTo)
            .set('format', format);

        if (filter.centerId) params = params.set('centerId', filter.centerId);
        if (filter.documentType?.length)
            filter.documentType.forEach((documentType) => (params = params.append('documentType', documentType)));
        if (filter.paymentStatus?.length)
            filter.paymentStatus.forEach((paymentStatus) => (params = params.append('paymentStatus', paymentStatus)));

        return this.http.get(`${environment.apiUrl}/reports/finance/invoices/export`, { params, responseType: 'blob' });
    }

    getFinanceSellersReport(filter: FinanceSellersReportFilter): Observable<FinanceSellerReportRow[]> {
        let params = new HttpParams().set('dateFrom', filter.dateFrom).set('dateTo', filter.dateTo);

        if (filter.sellerId) params = params.set('sellerId', filter.sellerId);
        if (filter.centerId) params = params.set('centerId', filter.centerId);

        return this.http
            .get<ApiResponse<FinanceSellerReportRow[]>>(`${environment.apiUrl}/reports/finance/sellers`, {
                params,
            })
            .pipe(map((res) => res.data));
    }

    exportFinanceSellersReport(filter: FinanceSellersReportFilter, format: ExportFormat): Observable<Blob> {
        let params = new HttpParams()
            .set('dateFrom', filter.dateFrom)
            .set('dateTo', filter.dateTo)
            .set('format', format);
        if (filter.sellerId) params = params.set('sellerId', filter.sellerId);
        if (filter.centerId) params = params.set('centerId', filter.centerId);

        return this.http.get(`${environment.apiUrl}/reports/finance/sellers/export`, { params, responseType: 'blob' });
    }

    getSellerEvolution(filter: SellerEvolutionFilter): Observable<SellerEvolution[]> {
        let params = new HttpParams()
            .set('dateFrom', filter.dateFrom)
            .set('dateTo',   filter.dateTo);
        if (filter.centerId) params = params.set('centerId', filter.centerId);

        const url = filter.sellerId
            ? `${environment.apiUrl}/dashboards/analytics/sellers/${filter.sellerId}/evolution`
            : `${environment.apiUrl}/dashboards/analytics/sellers/evolution`;

        return this.http
            .get<ApiResponse<SellerEvolution[]>>(url, { params })
            .pipe(map((res) => res.data));
    }

    getAnalyticsCashflow(filter: AnalyticsCashflowFilter): Observable<AnalyticsCashflow> {
        let params = new HttpParams()
            .set('dateFrom', filter.dateFrom)
            .set('dateTo',   filter.dateTo);
        if (filter.centerId) params = params.set('centerId', filter.centerId);

        return this.http
            .get<ApiResponse<AnalyticsCashflow>>(`${environment.apiUrl}/dashboards/analytics/cashflow`, { params })
            .pipe(map((res) => res.data));
    }

    getAnalyticsGrowth(filter: AnalyticsGrowthFilter): Observable<AnalyticsGrowth> {
        const params = new HttpParams()
            .set('dateFrom', filter.dateFrom)
            .set('dateTo',   filter.dateTo);

        return this.http
            .get<ApiResponse<AnalyticsGrowth>>(`${environment.apiUrl}/dashboards/analytics/growth`, { params })
            .pipe(map((res) => res.data));
    }

    getAnalyticsHeatmap(filter: AnalyticsHeatmapFilter): Observable<AnalyticsHeatmap> {
        const params = new HttpParams()
            .set('dateFrom', filter.dateFrom)
            .set('dateTo',   filter.dateTo)
            .set('year',     String(filter.year));

        return this.http
            .get<ApiResponse<AnalyticsHeatmap>>(`${environment.apiUrl}/dashboards/analytics/heatmap`, { params })
            .pipe(map((res) => res.data));
    }

    getCenterRevenue(filter: CenterRevenueFilter): Observable<CenterRevenue[]> {
        let params = new HttpParams()
            .set('dateFrom', filter.dateFrom)
            .set('dateTo', filter.dateTo);
        if (filter.centerId) params = params.set('centerId', filter.centerId);

        return this.http
            .get<ApiResponse<CenterRevenue[]>>(`${environment.apiUrl}/dashboards/analytics/center-revenue`, { params })
            .pipe(map((res) => res.data));
    }

    private toISODate(date: Date): string {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    }
}
