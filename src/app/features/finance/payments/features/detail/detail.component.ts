import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { Subscription } from 'rxjs';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { TagModule } from 'primeng/tag';
import { DividerModule } from 'primeng/divider';
import { TooltipModule } from 'primeng/tooltip';
import { PaymentService } from '../../../../../core/services/payment.service';
import {
    EntityPayment,
    Installment,
    InstallmentStatus,
    PaymentEntityType,
    PaymentMethod,
} from '../../../../../core/models/payment/installment';
import { Contract } from '../../../../../core/models/corporate/contract';

@Component({
    selector: 'app-payment-detail',
    templateUrl: './detail.component.html',
    standalone: true,
    imports: [CommonModule, RouterModule, ButtonModule, CardModule, TagModule, DividerModule, TooltipModule],
})
export class DetailComponent implements OnInit, OnDestroy {
    private route = inject(ActivatedRoute);
    private paymentService = inject(PaymentService);

    payment: EntityPayment | null = null;
    paymentId: string = '';
    loading = true;
    error: string | null = null;

    private subscriptions = new Subscription();

    ngOnInit(): void {
        this.subscriptions.add(
            this.route.params.subscribe((params) => {
                this.paymentId = params['id'];
                this.loadPayment();
            }),
        );
    }

    ngOnDestroy(): void {
        this.subscriptions.unsubscribe();
    }

    loadPayment(): void {
        if (!this.paymentId) {
            this.loading = false;
            this.error = 'Identificador de pagamento inválido.';
            return;
        }
        this.loading = true;
        this.error = null;

        this.subscriptions.add(
            this.paymentService.getPayment(this.paymentId).subscribe({
                next: (res) => {
                    this.payment = res.data;
                    this.loading = false;
                },
                error: (err) => {
                    console.error('Failed to load payment', err);
                    this.error = err?.error?.message || err?.message || 'Falha ao carregar pagamento.';
                    this.loading = false;
                },
            }),
        );
    }

    getInstallment(payment: EntityPayment | null): Installment | null {
        if (!payment || payment.paymentEntityType !== PaymentEntityType.INSTALLMENT) return null;
        return (payment.entity as Installment) ?? null;
    }

    getContract(payment: EntityPayment | null): Contract | null {
        if (!payment) return null;
        const installment = this.getInstallment(payment);
        if (installment?.contract) return installment.contract;

        if (payment.paymentEntityType === PaymentEntityType.CONTRACT) {
            return (payment.entity as Contract) ?? null;
        }
        return null;
    }

    getStudentCode(payment: EntityPayment | null): string | number | null {
        const student: any = this.getContract(payment)?.student;
        return student?.code ?? null;
    }

    getStudentName(payment: EntityPayment | null): string | null {
        const student: any = this.getContract(payment)?.student;
        if (!student) return null;
        if (student.name) return student.name;
        if (student.user) {
            const { firstname, lastname } = student.user;
            return [firstname, lastname].filter(Boolean).join(' ') || null;
        }
        return null;
    }

    getEntityTypeLabel(type: string | null | undefined): string {
        if (!type) return '-';
        switch (type) {
            case PaymentEntityType.INSTALLMENT:
                return 'Parcela';
            case PaymentEntityType.CONTRACT:
                return 'Contrato';
            default:
                return type;
        }
    }

    getEntityTypeSeverity(type: string | null | undefined): string {
        switch (type) {
            case PaymentEntityType.INSTALLMENT:
                return 'info';
            case PaymentEntityType.CONTRACT:
                return 'success';
            default:
                return 'secondary';
        }
    }

    getPaymentMethodLabel(method: string | null | undefined): string {
        if (!method) return '-';
        switch (method) {
            case PaymentMethod.CREDIT_CARD:
                return 'Cartão de Crédito';
            case PaymentMethod.DEBIT_CARD:
                return 'Cartão de Débito';
            case PaymentMethod.CASH:
                return 'Dinheiro';
            case PaymentMethod.BANK_TRANSFER:
                return 'Transferência Bancária';
            case PaymentMethod.MULTICAIXA:
                return 'Multicaixa';
            case PaymentMethod.MULTICAIXA_EXPRESS:
                return 'Multicaixa Express';
            case PaymentMethod.CHECK:
                return 'Cheque';
            default:
                return method.replace(/_/g, ' ');
        }
    }

    getInstallmentStatusLabel(status: string | null | undefined): string {
        switch (status) {
            case InstallmentStatus.PAID:
                return 'Pago';
            case InstallmentStatus.PENDING_PAYMENT:
                return 'Pendente';
            case InstallmentStatus.OVERDUE:
                return 'Vencido';
            case InstallmentStatus.CANCELLED:
                return 'Cancelado';
            case InstallmentStatus.EXTENDED_PAYMENT:
                return 'Prorrogado';
            default:
                return status ?? '-';
        }
    }

    getInstallmentStatusSeverity(status: string | null | undefined): string {
        switch (status) {
            case InstallmentStatus.PAID:
                return 'success';
            case InstallmentStatus.PENDING_PAYMENT:
                return 'warn';
            case InstallmentStatus.OVERDUE:
                return 'danger';
            case InstallmentStatus.CANCELLED:
                return 'secondary';
            default:
                return 'info';
        }
    }

    formatCurrency(amount: number | null | undefined, currency: string = 'AOA'): string {
        const safe = amount ?? 0;
        try {
            return new Intl.NumberFormat('pt-AO', {
                style: 'currency',
                currency,
            }).format(safe);
        } catch {
            return `${safe.toFixed(2)} ${currency}`;
        }
    }

    protected readonly PaymentEntityType = PaymentEntityType;
    protected readonly InstallmentStatus = InstallmentStatus;
}
