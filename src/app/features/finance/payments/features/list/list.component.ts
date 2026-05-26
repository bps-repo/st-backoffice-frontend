import { ChangeDetectionStrategy, Component, OnInit, inject } from '@angular/core';
import { AsyncPipe, DatePipe, NgIf } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { SelectButtonModule } from 'primeng/selectbutton';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { TooltipModule } from 'primeng/tooltip';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import {
    EntityPayment,
    Installment,
    PaymentEntityType,
    PaymentMethod,
} from '../../../../../core/models/payment/installment';
import { Contract } from '../../../../../core/models/corporate/contract';
import { PaymentsActions } from '../../../../../core/store/finance/payments/payments.actions';
import {
    selectAllPayments,
    selectPaymentsLoading,
    selectPaymentsSize,
    selectPaymentsTotalElements,
} from '../../../../../core/store/finance/payments/payments.selectors';
import {CurrencyFormatPipe} from '../../../../../shared/pipes/currency-format.pipe';
import {EntityTypeLabelPipe} from '../../../../../shared/pipes/entity-type-label.pipe';
import {EntityTypeSeverityPipe} from '../../../../../shared/pipes/entity-type-severity.pipe';
import {PaymentMethodLabelPipe} from '../../../../../shared/pipes/payment-method-label.pipe';

type PaymentMethodFilter = 'all' | PaymentMethod;
type EntityTypeFilter = 'all' | PaymentEntityType;

@Component({
    selector: 'app-general',
    templateUrl: './list.component.html',
    styleUrls: ['./list.component.scss'],
    standalone: true,
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [
        AsyncPipe,
        DatePipe,
        NgIf,
        RouterModule,
        FormsModule,
        ButtonModule,
        SelectButtonModule,
        TableModule,
        TagModule,
        TooltipModule,
        CurrencyFormatPipe,
        EntityTypeLabelPipe,
        EntityTypeSeverityPipe,
        PaymentMethodLabelPipe,
    ],
})
export class ListComponent implements OnInit {
    private store$ = inject(Store);

    payments: EntityPayment[] = [];
    filteredPayments: EntityPayment[] = [];

    methodFilter: PaymentMethodFilter = 'all';
    entityTypeFilter: EntityTypeFilter = 'all';

    loading$: Observable<boolean> = this.store$.select(selectPaymentsLoading);

    page = 0;
    size = 15;
    totalRecords = 0;

    totalPayments = 0;
    totalAmount = 0;
    installmentPayments = 0;
    contractPayments = 0;

    readonly entityTypeOptions: { label: string; value: EntityTypeFilter }[] = [
        { label: 'Todos', value: 'all' },
        { label: 'Parcelas', value: PaymentEntityType.INSTALLMENT },
        { label: 'Contratos', value: PaymentEntityType.CONTRACT },
    ];

    readonly paymentMethodOptions: { label: string; value: PaymentMethodFilter }[] = [
        { label: 'Todos', value: 'all' },
        { label: 'Dinheiro', value: PaymentMethod.CASH },
        { label: 'Cartão', value: PaymentMethod.CREDIT_CARD },
        { label: 'Transferência', value: PaymentMethod.BANK_TRANSFER },
        { label: 'Multicaixa', value: PaymentMethod.MULTICAIXA },
    ];

    constructor() {
        this.store$.select(selectAllPayments)
            .pipe(takeUntilDestroyed())
            .subscribe((list) => {
                this.payments = list;
                this.applyFilters();
                this.updateSummary();
            });

        this.store$.select(selectPaymentsTotalElements)
            .pipe(takeUntilDestroyed())
            .subscribe((total) => { this.totalRecords = total ?? 0; });

        this.store$.select(selectPaymentsSize)
            .pipe(takeUntilDestroyed())
            .subscribe((size) => { if (size) this.size = size; });
    }

    ngOnInit(): void {
        this.loadPayments();
    }

    loadPayments(page: number = this.page, size: number = this.size): void {
        this.page = page;
        this.size = size;
        this.store$.dispatch(PaymentsActions.loadPayments({ page, size }));
    }

    applyFilters(): void {
        let list = [...this.payments];

        if (this.entityTypeFilter !== 'all') {
            list = list.filter((p) => p.paymentEntityType === this.entityTypeFilter);
        }

        if (this.methodFilter !== 'all') {
            list = list.filter((p) => p.paymentMethod === this.methodFilter);
        }

        this.filteredPayments = list;
    }

    updateSummary(): void {
        this.totalPayments = this.payments.length;
        this.totalAmount = this.payments.reduce((sum, p) => sum + (p.amount || 0), 0);
        this.installmentPayments = this.payments.filter(
            (p) => p.paymentEntityType === PaymentEntityType.INSTALLMENT,
        ).length;
        this.contractPayments = this.payments.filter(
            (p) => p.paymentEntityType === PaymentEntityType.CONTRACT,
        ).length;
    }

    onPageChange(event: any): void {
        const newPage = event.first / event.rows;
        const newSize = event.rows;
        this.loadPayments(newPage, newSize);
    }

    getInstallmentEntity(payment: EntityPayment): Installment | null {
        if (payment.paymentEntityType !== PaymentEntityType.INSTALLMENT) return null;
        return (payment.entity as Installment) ?? null;
    }

    getContract(payment: EntityPayment): Contract | null {
        const installment = this.getInstallmentEntity(payment);
        if (installment?.contract) return installment.contract;

        if (payment.paymentEntityType === PaymentEntityType.CONTRACT) {
            return (payment.entity as Contract) ?? null;
        }
        return null;
    }

    getStudentCode(payment: EntityPayment): string | number | null {
        const contract = this.getContract(payment);
        const student: any = contract?.student;
        return student?.code ?? null;
    }

    getStudentName(payment: EntityPayment): string | null {
        const contract = this.getContract(payment);
        const student: any = contract?.student;
        if (!student) return null;
        if (student.name) return student.name;
        if (student.user) {
            const { firstname, lastname } = student.user;
            return [firstname, lastname].filter(Boolean).join(' ') || null;
        }
        return null;
    }

    getContractCode(payment: EntityPayment): string | null {
        return this.getContract(payment)?.code ?? null;
    }

    getContractId(payment: EntityPayment): string | null {
        return this.getContract(payment)?.id ?? null;
    }

    getInstallmentNumber(payment: EntityPayment): number | null {
        return this.getInstallmentEntity(payment)?.installmentNumber ?? null;
    }

    trackByPayment(_: number, payment: EntityPayment): string {
        return payment.id;
    }
}
