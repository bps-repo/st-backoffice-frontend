export interface SellerEvolutionMonthlyData {
    year: number;
    month: number;
    monthName: string;
    contractsSigned: number;
    revenue: number;
    collected: number;
    pending: number;
    collectionRate: number;
}

export interface SellerEvolution {
    sellerId: string;
    sellerName: string;
    centerName: string;
    totalContracts: number;
    totalRevenue: number;
    totalCollected: number;
    totalPending: number;
    collectionRate: number;
    averageTicket: number;
    overallRanking: number;
    bestMonth: string;
    worstMonth: string;
    monthlyData: SellerEvolutionMonthlyData[];
}

export interface SellerEvolutionFilter {
    dateFrom: string;
    dateTo: string;
    centerId?: string;
    /** When set, the single-seller endpoint is called */
    sellerId?: string;
}
