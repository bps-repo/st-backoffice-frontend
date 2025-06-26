import {Component, OnInit} from '@angular/core';
import {CommonModule} from '@angular/common';
import {RouterModule, ActivatedRoute} from '@angular/router';
import {
    Payment,
    PaymentInstallment,
    PaymentInstallmentStatus,
    PaymentStatus
} from "../../../../../core/models/payment/payment.model";

@Component({
    selector: 'app-student',
    templateUrl: './detail.component.html',
    standalone: true,
    imports: [CommonModule, RouterModule]
})
export class DetailComponent implements OnInit {
    payment: Payment | null = null;
    paymentId: number = 0;
    loading: boolean = true;
    error: string | null = null;

    // Progress calculation properties
    paidInstallmentsCount: number = 0;
    totalInstallmentsCount: number = 0;
    progressPercentage: number = 0;
    paidAmount: number = 0;
    pendingAmount: number = 0;

    constructor(private route: ActivatedRoute) {
    }

    ngOnInit(): void {
        this.route.params.subscribe(params => {
            this.paymentId = +params['id'];
            this.loadPayment();
        });
    }

    loadPayment(): void {
        // In a real app, this would fetch data from a service
        setTimeout(() => {
            this.payment = this.getMockPayment(this.paymentId);
            this.calculateProgress();
            this.loading = false;
        }, 500); // Simulate network delay
    }

    calculateProgress(): void {
        if (this.payment && this.payment.installments && this.payment.installments.length > 0) {
            this.totalInstallmentsCount = this.payment.installments.length;
            this.paidInstallmentsCount = this.payment.installments.filter(i => i.status === PaymentInstallmentStatus.PAID).length;
            this.progressPercentage = (this.paidInstallmentsCount / this.totalInstallmentsCount) * 100;

            // Calculate paid and pending amounts
            this.paidAmount = this.payment.installments
                .filter(i => i.status === PaymentInstallmentStatus.PAID)
                .reduce((sum, i) => sum + i.amount, 0);

            this.pendingAmount = this.payment.installments
                .filter(i => i.status !== PaymentInstallmentStatus.PAID)
                .reduce((sum, i) => sum + i.amount, 0);
        } else {
            this.totalInstallmentsCount = 0;
            this.paidInstallmentsCount = 0;
            this.progressPercentage = 0;
            this.paidAmount = 0;
            this.pendingAmount = 0;
        }
    }

    getMockPayment(id: number): Payment {
        // Mock data for demonstration
        return {
            id: id,
            invoice_id: 101,
            amount: 900,
            payment_date: new Date('2025-05-15'),
            payment_method: 'Credit Card',
            status: PaymentStatus.PARTIAL,
            reference: 'REF-123456',
            notes: 'Initial centers with installment plan',
            installments: [
                {
                    id: 1,
                    payment_id: id,
                    amount: 300,
                    due_date: new Date('2025-05-15'),
                    payment_date: new Date('2025-05-15'),
                    status: PaymentInstallmentStatus.PAID,
                    number: 1,
                    total_installments: 3
                },
                {
                    id: 2,
                    payment_id: id,
                    amount: 300,
                    due_date: new Date('2025-06-15'),
                    status: PaymentInstallmentStatus.PENDING,
                    number: 2,
                    total_installments: 3
                },
                {
                    id: 3,
                    payment_id: id,
                    amount: 300,
                    due_date: new Date('2025-07-15'),
                    status: PaymentInstallmentStatus.PENDING,
                    number: 3,
                    total_installments: 3
                }
            ]
        };
    }

    getStatusClass(status: string): string {
        switch (status) {
            case PaymentStatus.COMPLETED:
                return 'bg-success';
            case PaymentStatus.PARTIAL:
                return 'bg-warning';
            case PaymentStatus.PENDING:
                return 'bg-info';
            case PaymentStatus.FAILED:
                return 'bg-danger';
            case PaymentStatus.REFUNDED:
                return 'bg-secondary';
            default:
                return 'bg-light';
        }
    }

    getInstallmentStatusClass(status: string): string {
        switch (status) {
            case PaymentInstallmentStatus.PAID:
                return 'bg-success';
            case PaymentInstallmentStatus.PENDING:
                return 'bg-warning';
            case PaymentInstallmentStatus.OVERDUE:
                return 'bg-danger';
            case PaymentInstallmentStatus.CANCELLED:
                return 'bg-secondary';
            default:
                return 'bg-light';
        }
    }

    markAsPaid(installment: PaymentInstallment): void {
        if (!this.payment || !this.payment.installments) return;

        const index = this.payment.installments.findIndex(i => i.id === installment.id);
        if (index !== -1) {
            this.payment.installments[index].status = PaymentInstallmentStatus.PAID;
            this.payment.installments[index].payment_date = new Date();

            // Check if all installments are paid
            const allPaid = this.payment.installments.every(i => i.status === PaymentInstallmentStatus.PAID);
            if (allPaid) {
                this.payment.status = PaymentStatus.COMPLETED;
            }

            // Recalculate progress
            this.calculateProgress();
        }
    }
}
