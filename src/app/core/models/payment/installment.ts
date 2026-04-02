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

export type InstallmentStatus =
    | 'PENDING_PAYMENT'
    | 'PAID'
    | 'OVERDUE'
    | 'CANCELLED';

