import { Component, Input, OnChanges, OnDestroy, OnInit, SimpleChanges, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CardModule } from 'primeng/card';
import { TagModule } from 'primeng/tag';
import { ButtonModule } from 'primeng/button';
import { DividerModule } from 'primeng/divider';
import { DropdownModule } from 'primeng/dropdown';
import { ProgressBarModule } from 'primeng/progressbar';
import { TooltipModule } from 'primeng/tooltip';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ToastModule } from 'primeng/toast';
import { Store } from '@ngrx/store';
import { BehaviorSubject, Observable, Subscription, combineLatest, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { Contract } from '../../../../../../../../core/models/corporate/contract';
import { Installment, InstallmentPayment, InstallmentStatus } from '../../../../../../../../core/models/payment/installment';
import { ContractActions } from '../../../../../../../../core/store/corporate/contracts/contracts.actions';
import {
    selectAllContracts,
    selectContractsError,
    selectContractsLoading,
} from '../../../../../../../../core/store/corporate/contracts/contracts.selectors';
import { InstallmentsActions } from '../../../../../../../../core/store/finance/installments/installments.actions';

type InstallmentStatusFilter = 'ALL' | InstallmentStatus;

// Some backends enrich the installment with extra display metadata – we render them when present.
type RichInstallment = Installment & {
    receipt?: string;
    receiptNumber?: string;
};

@Component({
    selector: 'scholar-student-payment-tab',
    standalone: true,
    imports: [
        CommonModule,
        FormsModule,
        CardModule,
        TagModule,
        ButtonModule,
        DividerModule,
        DropdownModule,
        ProgressBarModule,
        TooltipModule,
        ConfirmDialogModule,
        ToastModule,
    ],
    providers: [ConfirmationService, MessageService],
    templateUrl: './payment.tab.component.html',
})
export class StudentPaymentTabComponent implements OnInit, OnChanges, OnDestroy {
    @Input() studentId: string | null = null;

    private store$ = inject(Store);
    private confirmationService = inject(ConfirmationService);
    private messageService = inject(MessageService);

    private readonly contractsSource$: Observable<Contract[]> = this.store$.select(selectAllContracts);
    private readonly selectedContractId$ = new BehaviorSubject<string | null>(null);
    private readonly statusFilter$ = new BehaviorSubject<InstallmentStatusFilter>('ALL');

    contracts$: Observable<Contract[]> = of([]);
    contractOptions$: Observable<{ label: string; value: string }[]> = of([]);
    selectedContract$: Observable<Contract | null> = of(null);
    filteredInstallments$: Observable<RichInstallment[]> = of([]);
    loading$: Observable<boolean> = of(false);
    error$: Observable<any> = of(null);

    selectedContractId: string | null = null;
    selectedContract: Contract | null = null;
    statusFilter: InstallmentStatusFilter = 'ALL';

    readonly statusFilterOptions: { label: string; value: InstallmentStatusFilter }[] = [
        { label: 'Todos', value: 'ALL' },
        { label: 'Pagos', value: InstallmentStatus.PAID },
        { label: 'Pendentes', value: InstallmentStatus.PENDING_PAYMENT },
        { label: 'Vencidos', value: InstallmentStatus.OVERDUE },
    ];

    private subscriptions = new Subscription();

    ngOnInit(): void {
        this.contracts$ = this.contractsSource$;
        this.loading$ = this.store$.select(selectContractsLoading);
        this.error$ = this.store$.select(selectContractsError);

        this.contractOptions$ = this.contractsSource$.pipe(
            map((contracts) =>
                contracts.map((contract) => ({
                    label: this.buildContractLabel(contract),
                    value: contract.id,
                })),
            ),
        );

        this.selectedContract$ = combineLatest([this.contractsSource$, this.selectedContractId$]).pipe(
            map(([contracts, id]) => {
                if (!contracts.length) return null;
                const found = id ? contracts.find((c) => c.id === id) : null;
                return found ?? contracts[0];
            }),
        );

        this.filteredInstallments$ = combineLatest([this.selectedContract$, this.statusFilter$]).pipe(
            map(([contract, filter]) => this.buildFilteredInstallments(contract, filter)),
        );

        this.subscriptions.add(
            this.contractsSource$.subscribe((contracts) => {
                if (!contracts.length) {
                    if (this.selectedContractId !== null) {
                        this.selectedContractId = null;
                        this.selectedContractId$.next(null);
                    }
                    return;
                }
                const stillExists = contracts.some((c) => c.id === this.selectedContractId);
                if (!stillExists) {
                    const next = contracts[0].id;
                    this.selectedContractId = next;
                    this.selectedContractId$.next(next);
                }
            }),
        );

        this.subscriptions.add(
            this.selectedContract$.subscribe((contract) => {
                this.selectedContract = contract;
            }),
        );
    }

    ngOnChanges(changes: SimpleChanges): void {
        if (changes['studentId'] && this.studentId) {
            this.store$.dispatch(
                ContractActions.loadContractsByStudent({ studentId: this.studentId }),
            );
        }
    }

    ngOnDestroy(): void {
        this.subscriptions.unsubscribe();
        // Clear student-scoped contracts so the global list view isn't polluted
        this.store$.dispatch(ContractActions.clearContracts());
    }

    onContractChange(contractId: string | null): void {
        this.selectedContractId = contractId;
        this.selectedContractId$.next(contractId);
    }

    onStatusFilterChange(value: InstallmentStatusFilter): void {
        this.statusFilter = value;
        this.statusFilter$.next(value);
    }

    reload(): void {
        if (this.studentId) {
            this.store$.dispatch(
                ContractActions.loadContractsByStudent({ studentId: this.studentId }),
            );
        }
    }

    downloadSelectedContract(contract: Contract | null): void {
        if (!contract) return;
        this.store$.dispatch(ContractActions.downloadContract({ contractId: contract.id }));
    }

    trackByInstallment(_: number, installment: RichInstallment): string {
        return installment.id ?? `${installment.installmentNumber}`;
    }

    trackByPayment(_: number, payment: InstallmentPayment): string {
        return payment.id;
    }

    getStats(contract: Contract | null): { label: string; value: string; color: string }[] {
        const currency = contract?.financial?.currency || 'AOA';
        const paid = this.getTotalPaidAmount(contract);
        const pending = this.getPendingAmount(contract);
        const overdue = this.getOverdueAmount(contract);
        const total =
            contract?.financial?.finalAmount ?? contract?.financial?.totalAmount ?? 0;

        return [
            { label: 'Total Pago', value: this.formatCurrency(paid, currency), color: 'text-green-500' },
            { label: 'Pendente', value: this.formatCurrency(pending, currency), color: 'text-yellow-600' },
            { label: 'Vencido', value: this.formatCurrency(overdue, currency), color: 'text-red-500' },
            { label: 'Total Curso', value: this.formatCurrency(total, currency), color: 'text-blue-500' },
        ];
    }

    getInstallmentTitle(installment: RichInstallment): string {
        if (!installment.dueDate) {
            return `Parcela ${installment.installmentNumber}`;
        }
        const months = [
            'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
            'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro',
        ];
        const date = new Date(installment.dueDate);
        if (Number.isNaN(date.getTime())) {
            return `Parcela ${installment.installmentNumber}`;
        }
        return `Mensalidade ${months[date.getMonth()]} ${date.getFullYear()}`;
    }

    getInstallmentBadge(installment: RichInstallment, total: number): string {
        const number = String(installment.installmentNumber).padStart(2, '0');
        const totalStr = String(total || 0).padStart(2, '0');
        return `${number}/${totalStr}`;
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
                return InstallmentStatus[status];
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

    getLatestPayment(installment: RichInstallment): InstallmentPayment | null {
        const payments = installment.payments ?? [];
        if (!payments.length) return null;
        return [...payments].sort((a, b) => {
            const aTime = a.paymentDate ? new Date(a.paymentDate).getTime() : 0;
            const bTime = b.paymentDate ? new Date(b.paymentDate).getTime() : 0;
            return bTime - aTime;
        })[0];
    }

    getPaymentDate(installment: RichInstallment): string | null {
        const latest = this.getLatestPayment(installment);
        return latest?.paymentDate ?? installment.paidAt ?? null;
    }

    getPaymentMethodLabel(method: string | null | undefined): string {
        if (!method) return '-';
        switch (method) {
            case 'CREDIT_CARD':
                return 'Cartão de Crédito';
            case 'DEBIT_CARD':
                return 'Cartão de Débito';
            case 'CASH':
                return 'Dinheiro';
            case 'BANK_TRANSFER':
                return 'Transferência Bancária';
            case 'MULTICAIXA':
                return 'Multicaixa';
            case 'MULTICAIXA_EXPRESS':
                return 'Multicaixa Express';
            case 'CHECK':
                return 'Cheque';
            default:
                return method.replace(/_/g, ' ');
        }
    }

    getPaymentMethod(installment: RichInstallment): string | null {
        return this.getLatestPayment(installment)?.paymentMethod ?? null;
    }

    getOverdueDays(installment: RichInstallment): number {
        if (installment.status !== InstallmentStatus.OVERDUE || !installment.dueDate) return 0;
        const due = new Date(installment.dueDate).getTime();
        const now = Date.now();
        const diffMs = now - due;
        if (diffMs <= 0) return 0;
        return Math.floor(diffMs / (1000 * 60 * 60 * 24));
    }

    getTotalInstallmentsCount(contract: Contract | null): number {
        return contract?.installments?.length ?? 0;
    }

    getPaidInstallmentsCount(contract: Contract | null): number {
        return (contract?.installments || []).filter((i) => i.status === InstallmentStatus.PAID).length;
    }

    getInstallmentProgress(contract: Contract | null): number {
        const total = this.getTotalInstallmentsCount(contract);
        if (!total) return 0;
        const paid = this.getPaidInstallmentsCount(contract);
        return Math.min(100, Math.round((paid / total) * 100));
    }

    getNextInstallment(contract: Contract | null): Installment | null {
        const pending = (contract?.installments || [])
            .filter((i) => i.status === InstallmentStatus.PENDING_PAYMENT || i.status === InstallmentStatus.OVERDUE)
            .sort((a, b) => {
                const aTime = a.dueDate ? new Date(a.dueDate).getTime() : 0;
                const bTime = b.dueDate ? new Date(b.dueDate).getTime() : 0;
                return aTime - bTime;
            });
        return pending[0] ?? null;
    }

    payInstallment(contract: Contract | null, installment: RichInstallment): void {
        if (!contract || !installment.id) return;
        this.confirmationService.confirm({
            header: 'Confirmar pagamento',
            message: `Confirmar o pagamento da parcela ${installment.installmentNumber} no valor de ${this.formatCurrency(
                installment.amount,
                contract.financial?.currency,
            )}?`,
            icon: 'pi pi-dollar',
            acceptLabel: 'Confirmar',
            rejectLabel: 'Cancelar',
            accept: () => {
                this.store$.dispatch(
                    InstallmentsActions.payInstallment({
                        installmentId: installment.id as string,
                        payload: { amount: installment.amount },
                    }),
                );
                this.messageService.add({
                    severity: 'success',
                    summary: 'Pagamento enviado',
                    detail: 'O pagamento foi registado com sucesso.',
                });
            },
        });
    }

    formatCurrency(amount: number | null | undefined, currency: string | null | undefined = 'AOA'): string {
        const safeAmount = amount ?? 0;
        const currencyCode = currency || 'AOA';
        try {
            return new Intl.NumberFormat('pt-AO', {
                style: 'currency',
                currency: currencyCode,
            }).format(safeAmount);
        } catch {
            return `${safeAmount.toFixed(2)} ${currencyCode}`;
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

    private getTotalPaidAmount(contract: Contract | null): number {
        return (contract?.installments || [])
            .filter((i) => i.status === InstallmentStatus.PAID)
            .reduce((sum, i) => sum + (i.amount || 0), 0);
    }

    private getPendingAmount(contract: Contract | null): number {
        return (contract?.installments || [])
            .filter((i) => i.status === InstallmentStatus.PENDING_PAYMENT)
            .reduce((sum, i) => sum + (i.amount || 0), 0);
    }

    private getOverdueAmount(contract: Contract | null): number {
        return (contract?.installments || [])
            .filter((i) => i.status === InstallmentStatus.OVERDUE)
            .reduce((sum, i) => sum + (i.amount || 0), 0);
    }

    private buildContractLabel(contract: Contract): string {
        const levelName = contract.student?.level?.name;
        return levelName ? `${contract.code} · ${levelName}` : contract.code;
    }

    private buildFilteredInstallments(
        contract: Contract | null,
        filter: InstallmentStatusFilter,
    ): RichInstallment[] {
        const installments = (contract?.installments || []) as RichInstallment[];
        const sorted = [...installments].sort(
            (a, b) => (a.installmentNumber || 0) - (b.installmentNumber || 0),
        );
        if (filter === 'ALL') return sorted;
        return sorted.filter((i) => i.status === InstallmentStatus[filter]);
    }

    protected readonly InstallmentStatus = InstallmentStatus;
}
