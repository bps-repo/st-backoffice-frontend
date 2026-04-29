import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, map } from 'rxjs';
import { environment } from 'src/environments/environment';
import { ApiResponse } from '../models/ApiResponseService';
import { FinanceOverview, FinanceOverviewFilter } from '../models/finance/finance-overview.model';

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

    private toISODate(date: Date): string {
        return date.toISOString().split('T')[0];
    }
}
