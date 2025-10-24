import {Component, OnInit, OnDestroy} from '@angular/core';
import {CommonModule} from '@angular/common';
import {RouterModule} from '@angular/router';
import {FormsModule} from '@angular/forms';
import {Installment, InstallmentStatus} from '../../../../../core/models/payment/installment';
import {ButtonModule} from 'primeng/button';
import {SelectButtonModule} from 'primeng/selectbutton';
import {TableModule} from 'primeng/table';
import {TagModule} from 'primeng/tag';
import {TooltipModule} from 'primeng/tooltip';
import {Store} from '@ngrx/store';
import {InstallmentsActions} from '../../../../../core/store/finance/installments/installments.actions';
import {
    selectAllInstallments,
    selectLoading,
    selectPage,
    selectSize,
    selectTotalElements
} from '../../../../../core/store/finance/installments/installments.selectors';
import {Observable, of, Subscription} from 'rxjs';
import {InstallmentService} from "../../../../../core/services/installment.service";

@Component({
    selector: 'app-general',
    templateUrl: './list.component.html',
    styleUrls: ['./list.component.scss'],
    standalone: true,
    imports: [CommonModule, RouterModule, FormsModule, ButtonModule, SelectButtonModule, TableModule, TagModule, TooltipModule]
})
export class ListComponent implements OnInit {
    installments: Installment[] = [];
    filteredInstallments: Installment[] = [];
    statusFilter: string = 'all';

    installments$: Observable<Installment[]> = of([]);

    // pagination
    page: number = 0;
    size: number = 15;
    totalRecords: number = 0;

    loading$: Observable<boolean> = of(false);

    // Summary counts
    totalInstallments: number = 0;
    paidInstallments: number = 0;
    pendingInstallments: number = 0;
    overdueInstallments: number = 0;

    constructor(private installmentsService: InstallmentService, private store$: Store,) {
        this.installments$ = this.store$.select(selectAllInstallments);
        this.loading$ = this.store$.select(selectLoading);
    }

    ngOnInit(): void {
        this.loadInstallments();
    }

    loadInstallments(page: number = this.page, size: number = this.size): void {
        this.store$.dispatch(InstallmentsActions.loadInstallments({page: page, size}))
        this.installments$.subscribe({
            next: (res) => {
                this.installments = res;
                this.applyFilters();
                this.updateSummary();
            },
            error: (err) => {
                console.error('Failed to load installments', err);
                this.installments = [];
                this.filteredInstallments = [];
                this.totalRecords = 0;
            }
        });
    }

    applyFilters(): void {
        if (this.statusFilter === 'all') {
            this.filteredInstallments = [...this.installments];
        } else {
            this.filteredInstallments = this.installments.filter(
                installment => installment.status === this.statusFilter
            );
        }
        this.updateSummary();
    }

    updateSummary(): void {
        this.totalInstallments = this.installments.length;
        this.paidInstallments = this.installments.filter(i => i.status === 'PAID').length;
        this.pendingInstallments = this.installments.filter(i => i.status === 'PENDING_PAYMENT').length;
        this.overdueInstallments = this.installments.filter(i => i.status === 'OVERDUE').length;
    }

    filterByStatus(status: string): void {
        this.statusFilter = status;
        this.applyFilters();
    }

    getStatusSeverity(status: InstallmentStatus | string): string {
        switch (status) {
            case 'PAID':
                return 'success';
            case 'PENDING_PAYMENT':
                return 'warning';
            case 'OVERDUE':
                return 'danger';
            case 'CANCELLED':
                return 'info';
            default:
                return 'secondary';
        }
    }

    markAsPaid(installment: Installment): void {
        const index = this.installments.findIndex(i => i.id === installment.id);
        if (index !== -1) {
            this.installments[index] = {
                ...this.installments[index],
                status: 'PAID',
                updatedAt: new Date().toISOString()
            } as Installment;
            this.applyFilters();
            this.updateSummary();
        }

        const payload = {
            paymentMethod: "CREDIT_CARD",
            installmentId: installment.id,
        }

        this.installmentsService.makePayment(installment.id, payload).subscribe({
            next: (res) => {
                console.log('Payment successful', res);
            },
            error: (err) => {
                console.error('Payment failed', err);
            }
        })
    }

    onPageChange(event: any) {
        const newPage = event.first / event.rows;
        const newSize = event.rows;
        this.loadInstallments(newPage, newSize);
    }
}
