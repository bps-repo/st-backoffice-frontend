export type FinanceContractStatus =
    | 'ACTIVE'
    | 'COMPLETED'
    | 'CANCELLED'
    | 'OVERDUE'
    | 'PENDING_PAYMENT'
    | 'EXTENDED_PAYMENT'
    | 'HOLD';

export type FinanceContractType = 'STANDARD' | 'VIP';

export interface FinanceContractReportRow {
    contractId: string;
    contractCode: string;
    contractType: FinanceContractType;
    status: FinanceContractStatus;
    startDate: string;
    endDate: string;
    studentId: string;
    studentName: string;
    studentCode: string;
    centerId: string;
    centerName: string;
    sellerId: string;
    sellerName: string;
    amount: number;
    discountPercent: number;
    enrollmentFee: number;
    levelName: string;
    totalInstallments: number;
    paidInstallments: number;
    totalPaid: number;
    totalPending: number;
}

export interface FinanceContractsReportFilter {
    dateFrom: string;
    dateTo: string;
    status?: FinanceContractStatus[];
    contractType?: FinanceContractType[];
    sellerId?: string;
    centerId?: string;
    page?: number;
    size?: number;
}
