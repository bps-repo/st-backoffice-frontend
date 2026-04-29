/** Row from `/dashboards/finance/sellers` */
export interface FinanceSeller {
    employeeId: string;
    employeeName: string;
    totalContracts: number;
    totalSalesAmount: number;
    totalPaidAmount: number;
    totalPendingAmount: number;
    averageContractValue: number;
    centerName: string;
}

/** Row from `/dashboards/finance/sellers/top` */
export interface FinanceSellerTopRanking {
    employeeId: string;
    employeeName: string;
    centerName: string;
    contractsSold: number;
    totalSalesValue: number;
    totalCollected: number;
    averageContractValue: number;
    ranking: number;
}

export interface FinanceSellersFilter {
    dateFrom: string;
    dateTo: string;
    centerId?: string;
}
