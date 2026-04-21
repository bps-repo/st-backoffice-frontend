import {Contract} from "../corporate/contract";

export interface Installment {
    id: string;
    installmentNumber: number;
    dueDate: string; // ISO date (YYYY-MM-DD)
    amount: number;
    status: InstallmentStatus; // backend enum as string
    contract: Contract;
    createdAt: string; // ISO datetime
    updatedAt: string; // ISO datetime
}


export type CreateInstallment = Omit<Installment, 'id' | 'contract' | 'createdAt' | 'updatedAt'>;

export enum InstallmentStatus {
    PENDING_PAYMENT = 'PENDING_PAYMENT',
    PAID = 'PAID',
    OVERDUE = 'OVERDUE',
    CANCELLED = 'CANCELLED',
    EXTENDED_PAYMENT = 'EXTENDED_PAYMENT',
}
