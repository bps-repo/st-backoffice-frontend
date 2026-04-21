import { Component, Input, OnChanges, SimpleChanges, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CardModule } from 'primeng/card';
import { TagModule } from 'primeng/tag';
import { ButtonModule } from 'primeng/button';
import { DividerModule } from 'primeng/divider';
import { TableModule } from 'primeng/table';
import { ProgressBarModule } from 'primeng/progressbar';
import { Store } from '@ngrx/store';
import { Observable, of } from 'rxjs';
import { Contract, ContractStatus } from '../../../../../../../../core/models/corporate/contract';
import { ContractActions } from '../../../../../../../../core/store/corporate/contracts/contracts.actions';
import {
    selectAllContracts,
    selectContractsError,
    selectContractsLoading,
} from '../../../../../../../../core/store/corporate/contracts/contracts.selectors';
import { Installment, InstallmentStatus } from 'src/app/core/models/payment/installment';

interface PaymentStat {
    label: string;
    value: string;
    color: string;
}

@Component({
    selector: 'scholar-student-payment-tab',
    standalone: true,
    imports: [
        CommonModule,
        CardModule,
        TagModule,
        ButtonModule,
        DividerModule,
        TableModule,
        ProgressBarModule,
    ],
    templateUrl: './payment.tab.component.html',
})
export class StudentPaymentTabComponent implements OnChanges {
    @Input() studentId: string | null = null;

    private store$ = inject(Store);

    contracts$: Observable<Contract[]> = of([]);
    loading$: Observable<boolean> = of(false);
    error$: Observable<any> = of(null);

    constructor() {
        this.contracts$ = this.store$.select(selectAllContracts);
        this.loading$ = this.store$.select(selectContractsLoading);
        this.error$ = this.store$.select(selectContractsError);
    }

    ngOnChanges(changes: SimpleChanges): void {
        if (changes['studentId'] && this.studentId) {
            this.store$.dispatch(
                ContractActions.loadContractsByStudent({ studentId: this.studentId })
            );
        }
    }

    reload(): void {
        if (this.studentId) {
            this.store$.dispatch(
                ContractActions.loadContractsByStudent({ studentId: this.studentId })
            );
        }
    }

    downloadContract(contractId: string): void {
        this.store$.dispatch(ContractActions.downloadContract({ contractId }));
    }

    trackByContract(_: number, contract: Contract): string {
        return contract.id;
    }

    trackByInstallment(_: number, installment: Installment): string {
        return installment.id ?? `${installment.installmentNumber}`;
    }

    getContractStats(contract: Contract): PaymentStat[] {
        const currency = contract.financial?.currency || 'AOA';
        const paid = this.getTotalByStatus(contract, InstallmentStatus.PAID);
        const pending = this.getTotalByStatus(contract, InstallmentStatus.PENDING_PAYMENT);
        const overdue = this.getTotalByStatus(contract, InstallmentStatus.OVERDUE);
        const total =
            contract.financial?.finalAmount ?? contract.financial?.totalAmount ?? 0;

        return [
            { label: 'Total Pago', value: this.formatCurrency(paid, currency), color: 'text-green-500' },
            { label: 'Pendente', value: this.formatCurrency(pending, currency), color: 'text-yellow-500' },
            { label: 'Vencido', value: this.formatCurrency(overdue, currency), color: 'text-red-500' },
            { label: 'Total Contrato', value: this.formatCurrency(total, currency), color: 'text-blue-500' },
        ];
    }

    getTotalByStatus(contract: Contract, status: InstallmentStatus): number {
        return (contract.installments || [])
            .filter(i => i.status === status)
            .reduce((sum, i) => sum + (i.amount || 0), 0);
    }

    getPaidInstallmentsCount(contract: Contract): number {
        return (contract.installments || []).filter(i => i.status === 'PAID').length;
    }

    getTotalInstallmentsCount(contract: Contract): number {
        return (contract.installments || []).length;
    }

    getPaymentProgress(contract: Contract): number {
        const total =
            contract.financial?.finalAmount ?? contract.financial?.totalAmount ?? 0;
        if (!total) return 0;
        const paid = this.getTotalByStatus(contract, InstallmentStatus.PAID);
        return Math.min(100, Math.round((paid / total) * 100));
    }

    getOverdueDays(installment: Installment): number {
        if (installment.status !== InstallmentStatus.OVERDUE || !installment.dueDate) return 0;
        const due = new Date(installment.dueDate).getTime();
        const now = Date.now();
        const diffMs = now - due;
        if (diffMs <= 0) return 0;
        return Math.floor(diffMs / (1000 * 60 * 60 * 24));
    }

    getInstallmentStatusLabel(status: Installment['status']): string {
        switch (status) {
            case InstallmentStatus.PAID:
                return 'Pago';
            case InstallmentStatus.PENDING_PAYMENT:
                return 'Pendente';
            case InstallmentStatus.OVERDUE:
                return 'Vencido';
            case InstallmentStatus.CANCELLED:
                return 'Cancelado';
            default:
                return status;
        }
    }

    getInstallmentStatusSeverity(status: Installment['status']): string {
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

    getContractStatusLabel(status: Contract['status']): string {
        switch (status) {
            case ContractStatus.ACTIVE:
                return 'Ativo';
            case ContractStatus.HOLD:
                return 'Em Espera';
            case ContractStatus.CANCELLED:
                return 'Cancelado';
            case ContractStatus.COMPLETED:
                return 'Finalizado';
            default:
                return status;
        }
    }

    getContractStatusSeverity(status: Contract['status']): string {
        switch (status) {
            case ContractStatus.ACTIVE:
                return 'success';
            case ContractStatus.HOLD:
                return 'warning';
            case ContractStatus.CANCELLED:
                return 'danger';
            case ContractStatus.COMPLETED:
                return 'info';
            default:
                return 'info';
        }
    }

    formatCurrency(amount: number | null | undefined, currency: string = 'AOA'): string {
        const safeAmount = amount ?? 0;
        try {
            return new Intl.NumberFormat('pt-AO', {
                style: 'currency',
                currency: currency || 'AOA',
            }).format(safeAmount);
        } catch {
            return `${safeAmount.toFixed(2)} ${currency}`;
        }
    }

    formatDate(dateString: string | null | undefined): string {
        if (!dateString) return '-';
        try {
            return new Date(dateString).toLocaleDateString('pt-BR');
        } catch {
            return dateString;
        }
    }
}
