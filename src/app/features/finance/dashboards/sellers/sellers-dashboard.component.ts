import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { distinctUntilChanged, map } from 'rxjs/operators';
import { SelectItem } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { CalendarModule } from 'primeng/calendar';
import { DropdownModule } from 'primeng/dropdown';
import { SkeletonModule } from 'primeng/skeleton';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { CenterActions } from 'src/app/core/store/corporate/center/centers.actions';
import * as CenterSelectors from 'src/app/core/store/corporate/center/centers.selector';
import { FinanceSellersActions } from 'src/app/core/store/finance/finance-sellers/finance-sellers.actions';
import {
    selectFinanceSellers,
    selectFinanceSellersError,
    selectFinanceSellersFilter,
    selectFinanceSellersLoading,
} from 'src/app/core/store/finance/finance-sellers/finance-sellers.selectors';
import { FinanceSellerTopRanking, FinanceSellersFilter } from 'src/app/core/models/finance/finance-sellers.model';

@Component({
    selector: 'app-finance-sellers-dashboard',
    standalone: true,
    imports: [
        CommonModule,
        FormsModule,
        CalendarModule,
        DropdownModule,
        ButtonModule,
        SkeletonModule,
        TableModule,
        TagModule,
    ],
    templateUrl: './sellers-dashboard.component.html',
})
export class SellersDashboardComponent implements OnInit {
    private readonly store = inject(Store);

    readonly loading$: Observable<boolean> = this.store
        .select(selectFinanceSellersLoading)
        .pipe(distinctUntilChanged());

    sellers: FinanceSellerTopRanking[] = [];
    error: string | null = null;
    dateRange: Date[] = [];
    selectedCenterId = '';

    readonly centerOptions$: Observable<SelectItem[]> = this.store.select(CenterSelectors.selectAllCenters).pipe(
        map((centers) => [
            { label: 'Todos os centros', value: '' },
            ...centers.map((c) => ({ label: c.name, value: c.id })),
        ]),
    );

    constructor() {
        this.store
            .select(selectFinanceSellers)
            .pipe(takeUntilDestroyed())
            .subscribe((rows) => (this.sellers = rows ?? []));

        this.store
            .select(selectFinanceSellersError)
            .pipe(takeUntilDestroyed())
            .subscribe((err) => (this.error = err ? 'Não foi possível carregar o ranking de vendedores.' : null));

        this.store
            .select(selectFinanceSellersFilter)
            .pipe(takeUntilDestroyed())
            .subscribe((filter) => {
                this.selectedCenterId = filter.centerId ?? '';
                const from = new Date(filter.dateFrom + 'T00:00:00');
                const to = new Date(filter.dateTo + 'T00:00:00');
                this.dateRange = [from, to];
            });
    }

    ngOnInit(): void {
        this.store.dispatch(CenterActions.loadCenters());
        this.dispatchLoad();
    }

    applyFilter(): void {
        this.dispatchLoad();
    }

    clearFilter(): void {
        this.selectedCenterId = '';
        const today = new Date();
        const oneYearAgo = new Date(today.getFullYear() - 1, today.getMonth(), today.getDate());
        this.dateRange = [oneYearAgo, today];
        this.dispatchLoad();
    }

    retryLoad(): void {
        this.store.dispatch(FinanceSellersActions.clearError());
        this.dispatchLoad();
    }

    private dispatchLoad(): void {
        const today = new Date();
        const oneYearAgo = new Date(today.getFullYear() - 1, today.getMonth(), today.getDate());

        const filter: FinanceSellersFilter = {
            dateFrom: this.dateRange?.[0] ? this.toISODate(this.dateRange[0]) : this.toISODate(oneYearAgo),
            dateTo: this.dateRange?.[1] ? this.toISODate(this.dateRange[1]) : this.toISODate(today),
            ...(this.selectedCenterId ? { centerId: this.selectedCenterId } : {}),
        };

        this.store.dispatch(FinanceSellersActions.loadSellers({ filter }));
    }

    private toISODate(date: Date): string {
        return date.toISOString().split('T')[0];
    }

    formatMoney(value: number): string {
        return new Intl.NumberFormat('pt-AO', {
            style: 'currency',
            currency: 'AOA',
            minimumFractionDigits: 2,
        }).format(value);
    }
}
