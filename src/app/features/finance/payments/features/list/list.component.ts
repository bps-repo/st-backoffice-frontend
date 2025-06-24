import {Component, OnInit} from '@angular/core';
import {CommonModule} from '@angular/common';
import {RouterModule} from '@angular/router';
import {PaymentInstallment, PaymentInstallmentStatus} from "../../../../../core/models/payment/payment.model";

@Component({
    selector: 'app-list',
    templateUrl: './list.component.html',
    styleUrls: ['./list.component.scss'],
    standalone: true,
    imports: [CommonModule, RouterModule]
})
export class ListComponent implements OnInit {
    installments: PaymentInstallment[] = [];
    filteredInstallments: PaymentInstallment[] = [];
    statusFilter: string = 'all';

    // Summary counts
    totalInstallments: number = 0;
    paidInstallments: number = 0;
    pendingInstallments: number = 0;
    overdueInstallments: number = 0;

    constructor() {
    }

    ngOnInit(): void {
        // In a real application, these would be fetched from a service
        this.loadMockData();
        this.applyFilters();
        this.updateSummary();
    }

    loadMockData(): void {
        // Mock data for demonstration
        this.installments = [
            {
                id: 1,
                payment_id: 1,
                amount: 300,
                due_date: new Date('2025-06-01'),
                payment_date: new Date('2025-05-28'),
                status: PaymentInstallmentStatus.PAID,
                number: 1,
                total_installments: 3
            },
            {
                id: 2,
                payment_id: 1,
                amount: 300,
                due_date: new Date('2025-07-01'),
                status: PaymentInstallmentStatus.PENDING,
                number: 2,
                total_installments: 3
            },
            {
                id: 3,
                payment_id: 1,
                amount: 300,
                due_date: new Date('2025-08-01'),
                status: PaymentInstallmentStatus.PENDING,
                number: 3,
                total_installments: 3
            },
            {
                id: 4,
                payment_id: 2,
                amount: 450,
                due_date: new Date('2025-05-15'),
                status: PaymentInstallmentStatus.OVERDUE,
                number: 1,
                total_installments: 2
            },
            {
                id: 5,
                payment_id: 2,
                amount: 450,
                due_date: new Date('2025-06-15'),
                status: PaymentInstallmentStatus.PENDING,
                number: 2,
                total_installments: 2
            },
            {
                id: 6,
                payment_id: 3,
                amount: 200,
                due_date: new Date('2025-04-10'),
                payment_date: new Date('2025-04-08'),
                status: PaymentInstallmentStatus.PAID,
                number: 1,
                total_installments: 3
            },
            {
                id: 7,
                payment_id: 3,
                amount: 200,
                due_date: new Date('2025-05-10'),
                payment_date: new Date('2025-05-12'),
                status: PaymentInstallmentStatus.PAID,
                number: 2,
                total_installments: 3
            },
            {
                id: 8,
                payment_id: 3,
                amount: 200,
                due_date: new Date('2025-06-10'),
                status: PaymentInstallmentStatus.PENDING,
                number: 3,
                total_installments: 3
            }
        ];
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
        this.paidInstallments = this.installments.filter(i => i.status === PaymentInstallmentStatus.PAID).length;
        this.pendingInstallments = this.installments.filter(i => i.status === PaymentInstallmentStatus.PENDING).length;
        this.overdueInstallments = this.installments.filter(i => i.status === PaymentInstallmentStatus.OVERDUE).length;
    }

    filterByStatus(status: string): void {
        this.statusFilter = status;
        this.applyFilters();
    }

    markAsPaid(installment: PaymentInstallment): void {
        const index = this.installments.findIndex(i => i.id === installment.id);
        if (index !== -1) {
            this.installments[index].status = PaymentInstallmentStatus.PAID;
            this.installments[index].payment_date = new Date();
            this.applyFilters();
        }
    }
}
