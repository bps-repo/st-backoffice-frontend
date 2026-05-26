export interface FinanceSellerReportRow {
    sellerId: string;
    sellerName: string;
    centerId: string;
    centerName: string;
    totalContracts: number;
    activeContracts: number;
    completedContracts: number;
    totalRevenue: number;
    totalCollected: number;
    totalPending: number;
    averageContractValue: number;
    collectionRate: number;
    contractsByStatus: Record<string, number>;
}

export interface FinanceSellersReportFilter {
    dateFrom: string;
    dateTo: string;
    sellerId?: string;
    centerId?: string;
}
