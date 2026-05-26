export interface FinanceCustomerReportRow {
    customerId: string;
    customerName: string;
    customerCode: string;
    email: string;
    phone: string;
    centerId: string;
    centerName: string;
    totalContracts: number;
    activeContracts: number;
    totalContractValue: number;
    totalPaid: number;
    totalPending: number;
    totalOverdue: number;
    lastContractDate: string;
}

export interface FinanceCustomersReportFilter {
    dateFrom: string;
    dateTo: string;
    centerId?: string;
    page?: number;
    size?: number;
}
