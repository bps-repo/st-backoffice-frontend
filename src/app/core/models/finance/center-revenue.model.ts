export interface CenterRevenueMonthlyData {
    year: number;
    month: number;
    monthName: string;
    revenue: number;
    collected: number;
    pending: number;
    contractCount: number;
}

export interface CenterRevenue {
    centerId: string;
    centerName: string;
    totalRevenue: number;
    totalCollected: number;
    totalPending: number;
    totalOverdue: number;
    totalContracts: number;
    collectionRate: number;
    monthlyData: CenterRevenueMonthlyData[];
}

export interface CenterRevenueFilter {
    dateFrom: string;
    dateTo: string;
    centerId?: string;
}
