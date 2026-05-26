import {Contract} from "../corporate/contract";

export enum PaymentEntityType {
    INSTALLMENT = 'INSTALLMENT',
    CONTRACT = 'CONTRACT',
}

export enum PaymentMethod {
    CASH = 'CASH',
    CREDIT_CARD = 'CREDIT_CARD',
    DEBIT_CARD = 'DEBIT_CARD',
    BANK_TRANSFER = 'BANK_TRANSFER',
    MULTICAIXA = 'MULTICAIXA',
    MULTICAIXA_EXPRESS = 'MULTICAIXA_EXPRESS',
    CHECK = 'CHECK',
}

export interface EntityPayment {
    id: string;
    amount: number;
    paymentEntityType: PaymentEntityType | string;
    paymentEntityId: string;
    paymentDate: string; // ISO date (YYYY-MM-DD)
    paymentMethod: PaymentMethod | string;
    // The underlying entity (Installment, Contract, ...) as returned by the API.
    // Shape depends on paymentEntityType. Kept loose so callers can narrow.
    entity?: Installment | Contract | Record<string, any>;
    createdAt?: string;
    updatedAt?: string;
}

// Backward compatible alias – payments array nested under an installment.
export type InstallmentPayment = EntityPayment;

export interface Installment {
    id: string;
    installmentNumber: number;
    dueDate: string; // ISO date (YYYY-MM-DD)
    amount: number;
    status: InstallmentStatus; // backend enum as string
    contract?: Contract;
    createdAt?: string; // ISO datetime
    updatedAt?: string; // ISO datetime
    paidAt?: string; // ISO datetime – present when status is PAID
    paymentReceivedBy?: string; // user id of the staff member that registered the payment
    payments?: EntityPayment[];
}


export type CreateInstallment = Omit<
    Installment,
    'id' | 'contract' | 'createdAt' | 'updatedAt' | 'paidAt' | 'paymentReceivedBy' | 'payments'
>;

export enum InstallmentStatus {
    PENDING_PAYMENT = 'PENDING_PAYMENT',
    PAID = 'PAID',
    OVERDUE = 'OVERDUE',
    CANCELLED = 'CANCELLED',
    EXTENDED_PAYMENT = 'EXTENDED_PAYMENT',
}
