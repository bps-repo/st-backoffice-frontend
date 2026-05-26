export type RevenueTrend = 'UP' | 'DOWN' | 'FLAT';

export interface AnalyticsGrowthMonthlyItem {
    year: number;
    month: number;
    monthName: string;
    revenue: number;
    collected: number;
    contracts: number;
    revenueGrowthRate?: number;
    collectionGrowthRate?: number;
    revenueTrend: RevenueTrend;
}

export interface AnalyticsGrowthRevenueMonth {
    year: number;
    month: number;
    monthName: string;
    totalRevenue: number;
    contractsSigned: number;
    unitsSold: number;
    growthVsPrevious: number;
}

export interface AnalyticsCenterGrowthRanking {
    centerId: string;
    centerName: string;
    currentPeriodRevenue: number;
    previousPeriodRevenue: number;
    growthRate: number;
    trend: RevenueTrend;
    ranking: number;
}

export interface AnalyticsProductGrowthRanking {
    productId?: string;
    productName?: string;
    currentPeriodRevenue?: number;
    previousPeriodRevenue?: number;
    growthRate?: number;
    trend?: RevenueTrend;
    ranking?: number;
}

export interface AnalyticsGrowth {
    periodRevenueGrowthRate: number;
    periodCollectionGrowthRate: number;
    periodContractsGrowthRate: number;
    bestRevenueMonth: AnalyticsGrowthRevenueMonth;
    worstRevenueMonth: AnalyticsGrowthRevenueMonth;
    highestMoMGrowth: number;
    lowestMoMGrowth: number;
    monthlyGrowth: AnalyticsGrowthMonthlyItem[];
    centerGrowthRanking: AnalyticsCenterGrowthRanking[];
    productGrowthRanking: AnalyticsProductGrowthRanking[];
}

export interface AnalyticsGrowthFilter {
    dateFrom: string;
    dateTo: string;
}
