export interface FinanceOverview {
    totalRevenue: number;
    monthlyRevenue: number;
    yearlyRevenue: number;
    revenueGrowth: number;
    totalCollected: number;
    monthlyCollected: number;
    collectionRate: number;
    totalPending: number;
    overdueAmount: number;
    overdueCount: number;
    totalActiveContracts: number;
    newContractsThisMonth: number;
    newContractsThisYear: number;
    averageContractValue: number;
    averageMonthlyIncome: number;
    currency: string;
    lastUpdated: string;
}

export interface FinanceOverviewFilter {
    dateFrom?: string;
    dateTo?: string;
    centerId?: string;
}
